// Scraping
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
let articles = [];

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", { articles });
  });

  app.get("/scrape", function(req, res) {
    articles = [];
    // First, we grab the body of the html with request
    request("https://www.reddit.com/r/javascript/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every <p> with a class = "title" and do the following....
      $("p.title").each(function(i, element) {
        // Save an empty result object
        var articleResult = {};
        // Add the text and href of every link, and save them as properties of the result object
        articleResult.title = $(this)
          .children("a")
          .text()
          .trim();
        articleResult.link = $(this)
          .children("a")
          .attr("href");
        articleResult.saved = false;

        // Discovered that some of the articles link directly back to the javascript subreddit
        // Within the <p> there is a <span> that contains URL domain information
        // All <span> elements with text = ('self.javascript') redirect to subreddit
        // the href redirect addresses are not complete URLs, need to prepend the reddit domain
        // Here we gather the domain information for <a>
        var domain = $(this)
          .children(".domain")
          .text();
        // if <a> redirects to js subreddit, prepend reddit domain and reassign to var
        if (domain === "(self.javascript)") {
          articleResult.link = "http://www.reddit.com" + articleResult.link;
        }
        articles.push(articleResult);
      });
      res.render("index", { articles });
    });
  });

  // ******************* Get All Saved articles *******************
  app.get("/savedArticles", function(req, res) {
    Article.find({})
      .populate("note")
      // now, execute query
      .exec(function(error, doc) {
        if (error) {
          console.log(error);
        } else {
          var articles = {
            article: doc
          };
          res.render("saved", articles);
        }
      });
  });

  // ******************* Save an article *******************
  app.post("/save/:id", function(req, res) {
    articles[req.params.id].saved = true;
    articles[req.params.id].key = req.params.id;

    var entry = new Article(articles[req.params.id]);
    function duplicateCheck(article) {
      Article.find(
        {
          title: article.title
        },
        function(err, article) {
          if (article.length) {
            console.log("duplicate article, not added");
          } else {
            // Article is not a duplcate, save it to DB
            entry.save(function(err, article) {
              if (err) {
                console.log(err);
              } else {
                // console.log("article: ", article);
              }
            });
          }
        }
      );
    }
    // Calling the duplicate checking function and passing in new Article instance
    duplicateCheck(entry);
    res.redirect("back");
  });

  // ******************* Delete selected Article *******************
  app.delete("/delete/:id/:articleKey", async (req, res) => {
    let index = req.params.articleKey;
    console.log("index= ", index);
    console.log("articles[0]:", articles[0]);
    articles[index].saved = false;
    //Find the specific article so we can access the associated Notes
    await Article.findById(
      {
        _id: req.params.id
      },
      function(err, object) {
        if (err) {
          return console.error(err);
        }
        var notes = object.note;
        if (notes.length) {
          // Remove each associated Note from database
          for (var i = 0; i < notes.length; i++) {
            var noteId = notes[i];
            Note.remove(
              {
                _id: noteId
              },
              function(error, doc) {
                if (error) {
                  console.log(error);
                } else console.log("notes deleted");
              }
            );
          }
        }
      }
    );

    await Article.findByIdAndRemove(req.params.id, function(error, doc) {
      if (error) {
        console.log(error);
      } else {
        console.log("article " + req.params.id + " was deleted");
      }
    });
    res.sendStatus(200);
  });

  // ******************* Add New Note *******************
  app.put("/saveNote/:id", async (req, res) => {
    var newNote = new Note(req.body);
    await newNote.save(function(error, doc) {
      if (error) {
        // Error will be logged if text is not entered into textfield upon submit
        console.log(error);
      } else {
        // Use the article id to find and update it's note
        Article.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              note: doc._id
            }
          },
          {
            new: true
          }
        )
          // Execute the above query
          .exec(function(err, doc) {
            if (err) {
              console.log(err);
            } else {
              var note = {
                Note: doc
              };
              res.render("saved", note);
            }
          });
      }
    });
  });

  // Delete selected Note
  app.delete("/deleteNote/:deleteId/:articleId", function(req, res) {
    Note.findOneAndRemove({
      _id: req.params.deleteId
    }).exec(function(err, removed) {
      Article.findOneAndUpdate(
        {
          _id: req.params.articleId
        },
        {
          $pull: {
            note: req.params.deleteId
          }
        },
        {
          new: true
        },
        function(err, removedFromArticle) {
          if (err) {
            console.error(err);
          }
          res.status(200).send(removedFromArticle);
        }
      );
    });
  });

  // ******************* Get Single Article Notes *******************
  app.get("/singleArticleNotes/:id", function(req, res) {
    console.log("get note: ", req.params.id);
    Article.findById({
      _id: req.params.id
    })
      .populate("note")
      // now, execute our query
      .exec(function(error, doc) {
        if (error) {
          console.log(error);
        } else {
          res.json(doc);
          // console.log("server-side return of article with notes" + doc.note);
        }
      });
  });
};
