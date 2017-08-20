
// if any article from database is displayed on screen, deleted the prompt to Scrape
if(document.querySelector(".mongoArticles")){
  $(".emtpyPlaceholder").remove();
}


// Button click to Intialize Scraping
$(document).on("click", ".scrapeButton", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .done(function(data){
    console.log("scrape return:" + data);
  });
});

// Button click to Save an Article
$(document).on("click", ".saveButton", function(){
  var thisId = $(this).attr("id");
  // Removes the article from the main page 
  $(this).closest(".mongoArticles").remove();
  $.ajax({
    method: "PUT",
    url: "/save/" + thisId
  })
  .done(function(){
    // ================= ??????????????????????????????????? =================
  });
});

// Button click to Delete an Article
$(document).on("click", ".deleteButton", function(){
  var thisId = $(this).attr("id");
  // Removes the article from the page 
  $(this).closest(".mongoArticles").remove();
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  })
  .done(function(){
    // ================= ??????????????????????????????????? =================
  });
});

// Button click to Add a Not
// $(document).on("click", ".addNoteButton", function(){
//   var thisId = $(this).attr("id");
//   // Removes the article from the main page 
//   $(this).closest(".mongoArticles").remove();
//   $.ajax({
//     method: "PUT",
//     url: "/save/" + thisId
//   })
//   .done(function(){
//     // ================= ??????????????????????????????????? =================
//   });
// });