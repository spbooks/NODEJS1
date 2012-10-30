'use strict';

var assert = require('assert')
  , db = require('../lib/db')
  , nocklib = require('../lib/nocklib')
  , should = require('should');

var exchangeData = {};

suite('database', function() {
  var insertedOrder;

  test('open should open database connection', function(done) {
    db.open(done);
  });
  test('insertOne should insert a transaction', function(done) {
    var ord = nocklib.generateRandomOrder(exchangeData);
    db.insertOne('transactions', ord, function(err, order) {
      should.not.exist(err);
      should.exist(order._id);
      insertedOrder = order;
      done();
    });
  });
  test('findOne should find a single transaction', function(done) {
    var id = insertedOrder._id;
    db.findOne('transactions', id, function(err, order) {
      should.not.exist(err);
      should.exist(order._id);
      order.price.should.eql(insertedOrder.price);
      order.volume.should.eql(insertedOrder.volume);
      done();
    });
  });
});