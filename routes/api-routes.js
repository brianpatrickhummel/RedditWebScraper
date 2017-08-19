// Scraping
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

module.exports = function(app) {

  // add scraped data to MongoDB
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.reddit.com/r/javascript/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("p.title").each(function(i, element) {
        // Save an empty result object
        var articleResult = {};
        var domain = $(this).children('.domain').text();
        // Add the text and href of every link, and save them as properties of the result object
        articleResult.title = $(this).children("a").text();
        articleResult.link = $(this).children("a").attr("href");
        // adds proper domain if redirecting internally to reddit.com articles
        if (domain === "(self.javascript)"){
          articleResult.link = "www.reddit.com" + articleResult.link;
        }
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(articleResult);
        // function to check if article already exists
        function duplicateCheck(article){
          Article.find({title : article.title}, function (err, docs) {
              if (docs.length){
                  return 0;
              }else{
                // Now, save that entry to the db
                entry.save(function(err, doc) {
                  // Log any errors
                  if (err) {
                    console.log(err);
                  }
                  // Or log the doc
                  else {
                    console.log(doc);
                  }
                });
              }
          });
        }
        duplicateCheck(entry);
      });
    });
  });

  // This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
}