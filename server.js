var express = require('express');
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require("mongoose");
// Models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var PORT = process.env.PORT || 3000;
var app = express();

// Serve static content for the app from the 'public' directory in the application directory.
app.use(express.static('public'));
// Morgan Logging
app.use(logger("dev"));
// Body-Parser Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Hanldebars Config
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//=================== Mongoose ===================
// Set Mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Database configuration with mongoose
var uristring = /* "mongodb://heroku_52ft34g8:dt67ql648ors7978n91vie8k03@ds149603.mlab.com:49603/heroku_52ft34g8" ||  */
                "mongodb://localhost/mongoosecheerio";
// New Mongoose connection logic                
mongoose.connect(uristring, {
  useMongoClient: true
});
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});
//=================================================

// Routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

app.listen(PORT, function () {
  console.log('Listening on Port ' + PORT);
});