
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
  $.ajax({
    method: "POST",
    url: "/save/" + thisId
  })
    .done(function () {
      // refreshes the page and makes a GET call for all unsaved articles
      window.location.href = '/';
    });
});

// Button click to Delete an Article
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


// Button click to Modify Notes
$('#addNoteModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var articleId = button.data('id') // Extract info from data-* attributes
  console.log("client-side: clicked button id= " + articleId);
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  $.ajax({
    method: "GET",
    url: "/singleArticleNotes/" + articleId
  })
    .done(function (result) {
      console.log("client-side receipt of article with notes" + result);
      // jQuery update the Modal
      for (var i = 0; i < result.note.length; i++) {
        var jsonReturn = JSON.stringify(result.note[i]);
        var Note = result.note[i];
        console.log("Note #" + i + " is: " + jsonReturn);
        var newdiv = 
        '<div class="panel panel-default">' +
        '<div class="panel-body text-center">' +
          '<div class="panel panel-default noteEntry">' +
              '<div class="panel-heading">' +
                '<h3 class="panel-title noteBody" >' +
                  Note.body +
                  '</h3>' +
              '</div>' +
              '<div class="panel-body">' +
                
                '<button type="button" class="btn btn-danger deleteNoteButton hvr-bounce-to-left id="' + Note._id + '">DELETE NOTE</button>' +
              '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
      $(".modal-body").append(newdiv);
      // $(".noteBody").text(Note.body);
      // $(".deleteNoteButton").attr("id", Note._id);
        
      }
      if (document.querySelector(".noteEntry")){
        $('.notePlaceholder').remove();
      }
      
        
      



  

      

       // Button click to Save a Note
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


    });
  
    
  // var modal = $(this)
  // modal.find('.modal-title').text('New message to ' + recipient)
  // modal.find('.modal-body input').val(recipient)


// Call the Modal
  // $('#addNoteModal').modal(options)


  if (document.querySelector(".noteEntry")){
    $('.notePlaceholder').remove();
  }
})



 

    
  // Button click to Delete a Note
  $(document).on("click", ".deleteNoteButton", function () {
    var deleteId = $(this).attr("id");
    $.ajax({
      method: "DELETE",
      url: "/deleteNote/" + deleteId + "/" + articleId,
    })
    .done(function () {
      window.location.href = "/savedArticles";
    });

  });