var nocklib = require('../lib/nocklib');

module.exports = {
  addStock: function(req, res) {
    if (req.xhr) {
      nocklib.addStock(req.session._id, req.body.stock, function(err, price) {
        res.send(price);
      });
    }
  },

  getIndex: function(req, res) {
    res.render('index');
  },
  
  getUser: function(req, res) {
    nocklib.getUser(req.params.username, function(err, user) {
      if (user)
        res.send('1');
      else
        res.send('0');
    });
  },
  
  portfolio: function(req, res) {
    nocklib.getUserById(req.session._id, function(err, user) {
      var portfolio = [];
      if (user && user.portfolio) portfolio = user.portfolio;
      nocklib.getStockPrices(portfolio, function(err, prices) {
        if (req.xhr) {
          var data = [];
          for (var i = 0; i < portfolio.length; i++) {
            data.push({stock: portfolio[i], price: prices[i]});
          }
          res.json(data);  
        } else {
          res.render('portfolio', {portfolio: portfolio, prices: prices, email: user.email});
        }
      });
    });
  },
  
  login: function(req, res) {
    nocklib.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        req.session.username = req.body.username;
        res.redirect('/portfolio');
      }
      else
        res.redirect('/');
    });    
  },
  
  signup: function(req, res) {
    nocklib.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      console.log(user);
      res.redirect('/portfolio');
    });
  }
}