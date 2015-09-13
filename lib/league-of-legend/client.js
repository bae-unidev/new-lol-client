var java = require("java");
java.classpath.push("lolrtmpclient.jar");


var EventEmitter = require('events').EventEmitter;

var LolClient = function(settings) {
  this.setting = settings;
  this.client = null;
};

LolClient.prototype = EventEmitter.prototype;

LolClient.prototype.connect = function(callback) {
  var self = this;
  java.newInstance("com.gvaneyck.rtmp.LoLRTMPSClient",
    this.setting.region,
    this.setting.locale,
    this.setting.host,
    this.setting.lqHost,
    this.setting.clientVersion,
    this.setting.username,
    this.setting.password,
    this.setting.useGarena,
    function(err, rtmpClient) {
      if(err) { console.error(err); return; }
        self.client = rtmpClient;
       java.callMethodSync(rtmpClient, "connectAndLogin");
       console.log(rtmpClient);
       callback(self);
  });
}
LolClient.prototype.getAcctId = function() {
  if (this.client != null) {
    return java.callMethodSync(this.client, "getAccountID");
  } else {
    return -1;
  }
};

LolClient.prototype.sendMessage = function(destination, operation, object) {
  if (this.client != null) {
    var newObject = java.newArray("java.lang.Object", object);

    var invokeId = java.callMethodSync(this.client, "invoke", destination, operation, newObject);
    return java.callMethodSync(this.client, "getResult", invokeId);
  }
  return null;
}

LolClient.prototype.close = function() {
  if (this.client != null)
  {
    java.callMethodSync(this.client, "close");
    this.client = null;
  }
};
module.exports = LolClient;
