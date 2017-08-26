# mongooseCheerio


## Heroku mLab - Mongo URI
mongodb://heroku_52ft34g8:dt67ql648ors7978n91vie8k03@ds149603.mlab.com:49603/heroku_52ft34g8

## Node.js application that scrapes the front-page of the "javascript" subreddit on Reddit.com. Users are able to save selected articles to a separate section of the website.  From that section, users can add comments to the saved articles, delete those comments or delete the saved articles.

##  The Node NPM Cheerio library is used for the web-scraping.  
## The scraped results are stored in a Mongo Database using Mongoose as an ORM.  

## Front-end is rendered primariy via Handlebars layouts. jQuery was utilized in order to dyamically which populate the Notes associated with each Article within a Boostrap Modal.