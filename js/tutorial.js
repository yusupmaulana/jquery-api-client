$(document).ready(function() {

  base_url = "http://localhost:8000/api/";

  // ========== Load All Tutorials ============
  $.ajax({
    type: "GET",
    url : base_url + "tutorial",
    dataType: "json",
  }).done(function(response){
    // console.log(response);
    $.each(response, function(i){
      $('#tutorial').append(
        "<li>" +
          response[i].title +
          "<button class='show-comments' data-id='" + response[i].id + "'>Show Comments</button>" +
        "</li>");
    });
  });

  // ========== Load All Comments ============

  $(document).on('click', '.show-comments', function(){
    _this = $(this);
    _id   = _this.attr('data-id');

    $.ajax({
      type: "GET",
      url : base_url + "tutorial/" + _id,
      dataType: "json",
    }).done(function(response){
      // console.log(response);
      $.each(response.comments, function(i){
        _this.after("<br> -"+response.comments[i].body + "-");
      });
    });
  });





});
