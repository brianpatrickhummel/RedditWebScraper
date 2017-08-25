
// If any article from database is displayed on screen, delete the Prompt to Scrape
if (document.querySelector(".mongoArticles")) {
  $(".emtpyPlaceholder").remove();
}


// Button click to Intialize Scraping
$(document).on("click", ".scrapeButton", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .done(function () {
      window.location.href = '/';
    });
});

// Button click to Save an Article
$(document).on("click", ".saveButton", function () {
  var thisId = $(this).attr("id");
  // Removes the article from the main page 
  // $(this).closest(".mongoArticles").remove();
  $.ajax({
    method: "POST",
    url: "/save/" + thisId
  })
    .done(function () {
      window.location.href = '/';
    });
});

// Button click to Delete an Article
$(document).on("click", ".deleteButton", function () {
  var thisId = $(this).attr("id");
  // Removes the article from the page 
  $(this).closest(".mongoArticles").remove();
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  })
    .done(function () {
      // ================= ??????????????????????????????????? =================
    });
});

// Button click to Add a Note
$(document).on("click", ".addNoteButton", function () {
  var thisId = $(this).attr("id");
  console.log(thisId);
  $(document).on("click", ".saveNoteButton", function (thisId) {
    $.ajax({
      method: "PUT",
      url: "/saveNote/" + thisId
    })
      .done(function () {
        // ================= ??????????????????????????????????? =================
      });
  });

  $('.notePlaceholder').remove();

})