// Scraping
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

module.exports = function (app) {

  // Scrape data and add to MongoDB
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    request("https://www.reddit.com/r/javascript/", function (error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every <p> with a class = "title" and do the following....
      
      $("p.title").each(function (i, element) {
        // Save an empty result object
        var articleResult = {};
        // Add the text and href of every link, and save them as properties of the result object
        articleResult.title = $(this).children("a").text().trim();
        articleResult.link = $(this).children("a").attr("href");

        // Discovered that some of the articles link directly back to the javascript subreddit
        // Within the <p> there is a <span> that contains URL domain information
        // All <span> elements with text = ('self.javascript') redirect to subreddit
        // the href redirect addresses are not complete URLs, need to prepend the reddit domain
        // Here we gather the domain information for <a>
        var domain = $(this).children('.domain').text();
        // if <a> redirects to js subreddit, prepend reddit domain and reassign to var
        if (domain === "(self.javascript)") {
          articleResult.link = "http://www.reddit.com" + articleResult.link;
        }

        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(articleResult);

        // Declaring a funtion to check the current article against the db
        // If an article with an identical title is found, article is not added
        function duplicateCheck(article) {
          Article.find({ title: article.title }, function (err, article) {
            if (article.length) {
              // console.log("duplicate article, not added");
            } else {
              // Article is not a duplcate, save it to DB
              entry.save(function (err, article) {
                // Log any errors
                if (err) {
                  console.log(err);
                }
                // Or log the doc
                else {
                  // console.log("article: ", article);
                }
              });
            }
          });
        }
        // Calling the duplicate checking function and passing in new Article instance
        duplicateCheck(entry);
      })

      res.redirect('back');
    })
  });

  // Get All scraped & unsaved articles from the mongoDB
  app.get("/", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        var articles = { article: doc };
        res.render("index", articles)
      }
    });
  });

  // Get All Saved articles
  app.get("/savedArticles", function (req, res) {
    Article.find({})
      .populate("note")
      // now, execute our query
      .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        var articles = { article: doc };
        res.render("saved", articles)
        // console.log(articles[0].note);
      }
    });
  });

  // Save an article
  app.post("/save/:id", function (req, res) {
    // Find article based on ID passed with req on POST and mark as having been SAVED
    Article.update({ "_id": req.params.id }, { $set: { saved: true } }, function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        res.render("index");
      }
    });
    // ================= ????????????? PUT RES ??????????????????? =================
  });

  // Delete selected Article
  app.delete("/delete/:id", function (req, res) {
    Article.findById({"_id": req.params.id}, function(err, object){
      if (err) { console.error(err) }  
      else {
        var notes = object.note;
        for (var i = 0; i < notes.length; i++) {
          var noteId = notes[i];
          Note.remove({"_id": noteId}, function (error, doc) {
            if (error) {
              console.log(error);
            }
            else {
              Article.remove({ "_id": req.params.id }, function (error, doc) {
                // Log any errors
                if (error) {
                  console.log(error);
                }
                else {
                  console.log("Note " + req.params.id + " was deleted")
                }
              });
            }
          });
        };
      }
    });
    res.sendStatus(200);
  });
  

  // Add/Update Note
  app.put("/saveNote/:id", function (req, res) {
    var newNote = new Note(req.body);

    newNote.save(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
        res.send("Please enter text before submitting");
      }
      // Otherwise
      else {
        // Use the article id to find and update it's note
        Article.findByIdAndUpdate(req.params.id, { $push: { "note": doc._id } }, { new: true })
        // Execute the above query
        .exec(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            var note = {"Note": doc};
            res.render("saved", note);
          }
        });
      }
    });

  });


  // Delete selected Note
  app.delete("/deleteNote/:deleteId/:articleId", function (req, res) {
    Note.findOneAndRemove({ "_id": req.params.deleteId })
      .exec(function(err, removed){
        Article.findOneAndUpdate(
          {"_id": req.params.articleId},
          { $pull: {note: req.params.deleteId}},
          { new: true },
          function(err, removedFromArticle) {
            if (err) { console.error(err) }
            res.status(200).send(removedFromArticle)
          })
      });
  });


  // Get Single Article Notes
  app.get("/singleArticleNotes/:id", function (req, res) {
    Article.findById({"_id": req.params.id})
      .populate("note")
      // now, execute our query
      .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        console.log(doc);
        res.json(doc);
        console.log("server-side return of article with notes" + doc.note);
      }
    });
  });


}






