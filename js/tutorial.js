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
        "<li class='wrapper' data-id='" + response[i].id + "'>" +
          "<span class='titles' data-id='" + response[i].id + "'>"+ response[i].title +"</span>" +
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


  // ========== Register user ============

  $(document).on('click', '#register', function(){

    $.ajax({
      type: "POST",
      url : base_url + "auth/signup",
      contentType: "application/json",
      data: JSON.stringify({
        username : $('#username').val(),
        email    : $('#email').val(),
        password : $('#password').val(),
      })
    }).done(function(response){
      console.log(response);
      alert("berhasil daftar!");
      // kosongkan field
      $('#username').val('');
      $('#email').val('');
      $('#password').val('');

      });
  });


  // ========== Login user ============

  $(document).on('click', '#login', function(){

    $.ajax({
      type: "POST",
      url : base_url + "auth/signin",
      contentType: "application/json",
      data: JSON.stringify({
        username : $('#username').val(),
        password : $('#password').val(),
      })
    }).done(function(response){
      $.cookie('token', response.token);
      alert("berhasil login!");
      // kosongkan field
      $('#username').val('');
      $('#password').val('');

      $('#user').toggle();

      });
  });


  // ========== Akses Halaman Profile ============

  $(document).on('click', '#get_profile', function () {

    $.ajax({
      type: "GET",
      url: base_url + "profile",
      headers: {
        "Authorization" : 'Bearer ' + $.cookie('token')
      }
    }).done(function (response) {
      console.log(response);
    });
  });


  // ========== Membuat Tutorial Baru ============

  $(document).on('click', '#send_tut', function () {

    $.ajax({
      type: "POST",
      url: base_url + "tutorial",
      contentType: "application/json",
      data: JSON.stringify({
        title: $('#title').val(),
        body : $('#body').val(),
      }),
      headers: {
        "Authorization": 'Bearer ' + $.cookie('token')
      }
    }).done(function (response) {
      // console.log(response);
      alert('tutorial berhasil dibuat!');
      $('#title').val(''); $('#body').val('');

      $('#tutorial').append(
        "<li class='wrapper' data-id='" + response.id + "'>" +
        "<span class='titles' data-id='" + response.id + "'>" + response.title + "</span>" +
        "<button class='show-comments' data-id='" + response.id + "'>Show Comments</button>" +
        "</li>");
      }).fail(function (xhr, status, error) {
        if (xhr.status == 400) {
          alert('harus login dulu gan');
        }
      });
  });



  // ========== Edit Tutorial lama ============

  $(document).on('click', '#edit_tut', function () {

    _id = $('#id_tut').val();
    _title = $('#new_title').val();

    $.ajax({
      type: "PUT",
      url: base_url + "tutorial/" + _id,
      contentType: "application/json",
      data: JSON.stringify({
        title: _title,
        body: $('#new_body').val(),
      }),
      headers: {
        "Authorization": 'Bearer ' + $.cookie('token')
      }
    }).done(function (response) {
      // console.log(response);
      alert('tutorial berhasil diedit!');
      $('#new_title').val(''); $('#new_body').val('');
      $(".titles[data-id="+ _id +"]").text(_title);      
    }).fail(function(xhr, status, error){
      if (xhr.status == 403) {
        alert(JSON.parse(xhr.responseText).error);
      } else if (xhr.status == 400) {
        alert('harus login dulu gan');
      }
    });
  });


  // ========== Hapus Tutorial ============

  $(document).on('click', '#del_tut', function () {

    _id = $('#id_tut_del').val();

    $.ajax({
      type: "DELETE",
      url: base_url + "tutorial/" + _id,
      headers: {
        "Authorization": 'Bearer ' + $.cookie('token')
      }
    }).done(function (response) {
      alert('tutorial berhasil dihapus!');
      // console.log(response);
      $(".wrapper[data-id=" + _id + "]").remove();
    }).fail(function(xhr, status, error){
      if(xhr.status == 403){
        alert(JSON.parse(xhr.responseText).error);
      }else if(xhr.status == 400){
        alert('harus login dulu gan');
      }
    });
  });


  //fungsi untuk logout
  $('#logout').on('click', function(){
    $.removeCookie('token');
    $('#user').toggle();
  });

});
