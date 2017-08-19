// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  var articleDiv = $("<div>").attr("id", "articles").addClass("col-md-12 text-center");
  $(".articlesContainer").append(articleDiv);
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<div data-id='" + data[i]._id + "'><h4>" + data[i].title + "</h4><br /><p>" + data[i].link + "</p></div>");
  }
});



$(document).on("click", ".scrapeButton", function(){
  console.log("clicked");
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .done(function(data){
    alert(data.length + " new articles have been added");
  });
});

