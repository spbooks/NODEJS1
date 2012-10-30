'use strict';

var $ = require('jquery')
  , BinaryHeap = require('./BinaryHeap');

var BUY = "buys", SELL = "sells";

function createBinaryHeap(orderType) {
  return new BinaryHeap(function (x) {
    return x;
  }, orderType);
}

function createExchange(exchangeData) {
  var cloned = $.extend(true, {}, exchangeData);
  cloned.trades = [];
  init(cloned, BUY);
  init(cloned, SELL);
  return cloned;

  function init(exchange, orderType) {
    if (!exchange[orderType]) {
      exchange[orderType] = {};
      exchange[orderType].volumes = {};
      var options = {};
      if (BUY == orderType) options.max = true;
      exchange[orderType].prices = createBinaryHeap(options);
      }
    }
  } module.exports = {
  BUY: BUY,
  SELL: SELL,
  buy:function (price, volume, exchangeData) {
    return order(BUY, price, volume, exchangeData);
  },
  sell:function (price, volume, exchangeData) {
    return order(SELL, price, volume, exchangeData);
  },
  order: order,
  getDisplay: function(exchangeData) {
    var options = {max: true};
    var buyPrices = createBinaryHeap(options);
    var sellPrices = createBinaryHeap(options);
    var buys = exchangeData.buys;
    var sells = exchangeData.sells;
    
    if (sells) {
      for (var price in sells.volumes) {
	sellPrices.push(price);
      }
    }
    if (buys) {
      for (var price in buys.volumes) {
	buyPrices.push(price);
      }
    }
    
    var padding = "        | ";
    var stringBook = "\n";
    
    while (sellPrices.size() > 0) {
      var sellPrice = sellPrices.pop()
      stringBook += padding + sellPrice + ", " + sells.volumes[sellPrice] + "\n";
    }
    while (buyPrices.size() > 0) {
      var buyPrice = buyPrices.pop();
      stringBook += buyPrice + ", " + buys.volumes[buyPrice] + "\n";
    }
    stringBook += "\n\n";
    for (var i=0; exchangeData.trades && i < exchangeData.trades.length; i++) {
      var trade = exchangeData.trades[i];
      stringBook += "TRADE " + trade.volume + " @ " + trade.price + "\n";
    }
    return stringBook;
  }
}

function order(orderType, price, volume, exchangeData) {
  // Init
  var cloned = createExchange(exchangeData);
  var orderBook = cloned[orderType];
  var oldVolume = orderBook.volumes[price];
  
  function getOpposite() {
    return (BUY == orderType) ? SELL: BUY;
  }
  function isTrade() {
    var opp = cloned[getOpposite()].prices.peek();
    return (BUY == orderType) ? price >= opp : price <= opp;
  }
  var trade = isTrade();
  var remainingVolume = volume;
  var storePrice = true;
  
  if (trade) {
    var oppBook = cloned[BUY]
    if (orderType == BUY) oppBook = cloned[SELL]
    
    while (remainingVolume > 0 && Object.keys(oppBook.volumes).length > 0) {
      var bestOppPrice = oppBook.prices.peek();
      var bestOppVol = oppBook.volumes[bestOppPrice];
      
      if (bestOppVol > remainingVolume) {
	cloned.trades.push({price:bestOppPrice, volume:remainingVolume});
	oppBook.volumes[bestOppPrice] = oppBook.volumes[bestOppPrice] - remainingVolume;
	remainingVolume = 0;
	storePrice = false;
      }
      else {
	if (bestOppVol == remainingVolume) storePrice = false;
	cloned.trades.push({price:bestOppPrice, volume:oppBook.volumes[bestOppPrice]});
	remainingVolume = remainingVolume - oppBook.volumes[bestOppPrice];
	// Pop the best price from the heap
	oppBook.prices.pop();
	delete oppBook.volumes[bestOppPrice];
	}
      }
    }
    if (!oldVolume && storePrice) cloned[orderType].prices.push(price);
      
    var newVolume = remainingVolume;
    
    // Add to existing volume
    if (oldVolume) newVolume += oldVolume;
    if (newVolume > 0) orderBook.volumes[price] = newVolume;
    return cloned;
  }