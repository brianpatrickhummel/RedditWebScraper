// Scraping
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

module.exports = function(app) {

  // Scrape data and add to MongoDB
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.reddit.com/r/javascript/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every <p> with a class = "title" and do the following....
      $("p.title").each(function(i, element) {
        // Save an empty result object
        var articleResult = {};
        // Add the text and href of every link, and save them as properties of the result object
        articleResult.title = $(this).children("a").text();
        articleResult.link = $(this).children("a").attr("href");

        // Discovered that some of the articles link directly back to the javascript subreddit
        // Within the <p> there is a <span> that contains URL domain information
        // All <span> elements with text = ('self.javascript') redirect to subreddit
        // the href redirect addresses are not complete URLs, need to prepend the reddit domain
        // Here we gather the domain information for <a>
        var domain = $(this).children('.domain').text();
        // if <a> redirects to js subreddit, prepend reddit domain and reassign to var
        if (domain === "(self.javascript)"){
          articleResult.link = "www.reddit.com" + articleResult.link;
        }

        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(articleResult);

        // Declaring a funtion to check the current article against the db
        // If an article with an identical title is found, article is not added
        function duplicateCheck(article){
          Article.find({title : article.title}, function (err, docs) {
              if (docs.length){
                  console.log("duplicate article, not added");
              }else{
                // Article is not a duplcate, save it to DB
                entry.save(function(err, doc) {
                  // Log any errors
                  if (err) {
                    console.log(err);
                  }
                  // Or log the doc
                  else {
                    console.log(doc);
                    // ================= ??????????????????????????????????? =================
                  }
                });
              }
          });
        }
        // Calling the duplicate checking function and passing in new Article instance
        duplicateCheck(entry);
      })
      // ================= ????????????????request RES ??????????????????? =================
    })
    // ================= ???????????????? Get RES ??????????????????? =================
  });

  // Get ALL articles scraped from the mongoDB
  app.get("/", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        var articles = {article: doc};
        res.render("index", articles )
      }
    });
  });

  // Save an article
  app.put("/save/:id", function(req, res) {
    // Find article based on ID passed with req on POST and mark as having been SAVED
    Article.update({"_id": req.params.id}, { $set: { saved: true }}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // ================= ??????????????????????????????????? =================
      }
    });
    // ================= ????????????? PUT RES ??????????????????? =================
  });

  // Get SAVED articles
  app.get("/savedArticles", function(req, res) {
    Article.find({}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        var articles = {article: doc};
        res.render("saved", articles )
      }
    });
  });

   // Delete selected Article
   app.delete("/delete/:id", function(req, res) {
    Article.remove({"_id": req.params.id}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        var articles = {article: doc};
        res.render("saved", articles )
      }
    });
  });

  // Add/Update Note

 

  // Delete selected Note





}