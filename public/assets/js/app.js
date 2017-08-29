// If any article from database is displayed on screen, delete the Prompt to Scrape
if (document.querySelector(".mongoArticles")) {
  $(".emtpyPlaceholder").remove();
}

// CircleType.js
var headerArc = new CircleType(document.getElementById('headerArc')).radius(1800);
var headerArc2 = new CircleType(document.getElementById('headerArc2')).radius(1800);


//*************** Button click to Intialize Scraping ***************
$(document).on("click", ".scrapeButton", function () {
  $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .done(function () {
      window.location.href = '/';
    });
});

//*************** Button click to Save an Article ***************
$(document).on("click", ".saveButton", function () {
  var thisId = $(this).attr("id");
  $.ajax({
      method: "POST",
      url: "/save/" + thisId
    })
    .done(function () {
      // refreshes the page and makes a GET call for all unsaved articles
      window.location.href = '/';
    });
});

//*************** Button click to Delete an Article ***************
$(document).on("click", ".deleteButton", function () {
  var thisId = $(this).attr("id");
  $.ajax({
      method: "DELETE",
      url: "/delete/" + thisId
    })
    .done(function () {
      // refreshes the page and makes a GET call for all saved articles
      window.location.href = "/savedArticles";
    });
});


//*************** Button click to View/Add/Delete Notes ***************
// When the Bootstrap modal is triggered...
$('#addNoteModal').on('show.bs.modal', function (event) {
  // Removes the existing DOM Modal panels from previous query
  $(".articleNotes").remove();
  // Identify Button that triggered the modal
  var button = $(event.relatedTarget)
  // Extract article id from data-id attribute
  var articleId = button.data('id')
  // console.log("client-side: clicked button id= " + articleId);

  // Get a single article including it's notes
  $.ajax({
      method: "GET",
      url: "/singleArticleNotes/" + articleId
    })
    .done(function (result) {
      // jQuery update the Bootstrap Modal
      for (var i = 0; i < result.note.length; i++) {
        var jsonReturn = JSON.stringify(result.note[i]);
        var Note = result.note[i];
        var newdiv =
          '<div class="panel panel-default articleNotes">' +
          '<div class="panel-body text-center">' +
          '<div class="panel panel-default noteEntry">' +
          '<div class="panel-heading">' +
          '<h3 class="panel-title noteBody" >' +
          Note.body +
          '</h3>' +
          '</div>' +
          '<div class="panel-body">' +

          '<button type="button" class="btn btn-danger deleteNoteButton hvr-bounce-to-left" id="' + Note._id + '">DELETE NOTE</button>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
        $(".form-group").prepend(newdiv);
      }
      // *************** If note is present, remove placeholder text ***************
      if (document.querySelector(".noteEntry")) {
        $('.notePlaceholder').remove();
      }

      // *************** Button click to Save a Note ***************
      $(document).on("click", ".saveNoteButton", function () {
        $.ajax({
            method: "PUT",
            url: "/saveNote/" + articleId,
            data: {
              // Value taken from note textarea
              body: $("#comment").val()
            }
          })
          .done(function () {
            // clear the typed note
            $("#comment").val("");
            window.location.href = "/savedArticles";
          });
      })

      // *************** Button click to Delete a Note ***************
      $(".deleteNoteButton").on("click", function () {
        var deleteId = $(this).attr("id");
        console.log("Note ID to be deleted: " + deleteId);
        $.ajax({
            method: "DELETE",
            url: "/deleteNote/" + deleteId + "/" + articleId,
          })
          .done(function () {
            window.location.href = "/savedArticles";
          });
      });
    });
});