$(document).ready(function() {
  $('.uname').blur(function(e) {
    $.ajax({type: 'GET', url: '/api/user/' + $('.uname').val()
    }).done(function(found) {
      if (found == '1') {
        $('#imagePlaceHolder').html('<img src="http://spbooks.github.com/nodejs1/cross.png" alt="cross"> Username already taken');
        $('.create-button').addClass('disabled').attr('disabled', true);
      }
      else {
        $('#imagePlaceHolder').html('<img src="http://spbooks.github.com/nodejs1/tick.png" alt="tick">');
        $('.create-button').removeClass('disabled').attr('disabled', false);
      }
    });
  });
});