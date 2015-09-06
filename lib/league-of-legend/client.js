var authenticate = require('../authorization/login');
var EventEmitter = require('events').EventEmitter;

var LolClient = function(settings) {
  this.setting = settings;
};

LolClient.prototype = EventEmitter.prototype;

LolClient.prototype.connect = function(callback) {
  var _authenticate = authenticate(this);
  console.log(_authenticate);
  _authenticate.connect(callback);
}

module.exports = LolClient;
