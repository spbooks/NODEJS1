var socket = io.connect('http://localhost');
$(document).ready(function() {
  $('.chat-widget').hide();
  $('#join-chat').click(function() {
    $('#join-chat').hide();
    $('.chat-widget').show();
    socket.emit('joined', {});
  });
  $('#send-chat').click(function() {
    socket.emit('clientchat', {message: $('#input01').val()});
  });
  
  socket.on('chat', function (data) {
    $('#textarea').append(data.message);
    if (data.username) {
      $('#users').append('<span class="label label-success" id="username-' + data.username + '">' + data.username + '</span>');
    }
    if (data.users) {
      var userHtml = '';
      for (var i=0; i < data.users.length; i++) {
        userHtml += '<span class="label label-success" id="username-' + data.users[i] + '">' + data.users[i] + '</span>';
      }
      $('#users').html(userHtml);
    }
  });
  socket.on('disconnect', function (data) {
    $('#username-' + data.username).remove();
  });
});