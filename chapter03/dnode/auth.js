var dnode = require('dnode');
dnode(function(remote, conn) {
  this.auth = function(user, pass, cb) {
    var users = {
      foo: 'bar'
    };
    var p = users[user];
    if (p === pass) cb(null, 'AUTHORIZED!');
    else cb('REMOTE ACCESS DENIED');
  };
}).listen(process.argv[2]);