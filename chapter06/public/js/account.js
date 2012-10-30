$(document).ready(function() {
  $('#update-account').click(function() {
    socket.emit('updateAccount', {email: $('#email').val()});
  });
});
socket.on('updateSuccess', function (data) {
  var html = "<div class='alert alert-success'><i class='icon-ok'></i> Email updated!</div>";
  $(html).hide().appendTo('h3').fadeIn("fast").delay("2000").fadeOut("fast");
});