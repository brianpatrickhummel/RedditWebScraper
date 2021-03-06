# Javascript Sub-Reddit Scraper

A Node.js application that scrapes reddit articles from the Javascript sub-reddit.  Users can save articles and then leave comments.  Articles and comments are stored in MongoDB via mLab. Uses the Mongoose, Handlebars and Cheerio NPM libraries. 

### Details:
* Server and API is built with Node.js using the Express Framework.   
* The Node npm Cheerio Library scrapes the front-page of the "javascript" sub-reddit on Reddit.com. 
* The scraped results are stored in a Mongo Database using Mongoose as an ORM.
* Users are able to save selected articles to a separate section of the website.  From that section, users can add comments to the saved articles, delete those comments or delete the saved articles.
* Front-end is rendered primarily via Handlebars. Layout via Bootstrap Framework. jQuery was utilized to dynamically populate the Notes associated with each Article within a Bootstrap Modal. 
* Deployed to Heroku using the mLab cloud-hosted MongoDB service