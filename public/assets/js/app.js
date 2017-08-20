
// if any article from database is displayed on screen, deleted the prompt to Scrape
if(document.querySelector(".mongoArticles")){
  $(".emtpyPlaceholder").remove();
}

$(document).on("click", ".scrapeButton", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .done(function(data){
    alert(data + " new articles have been added");
    console.log("on client, numArticles: " + data);
  });
});

