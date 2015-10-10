var java = require("java");
java.classpath.push("lolrtmpclient.jar");

var EventEmitter = require('events').EventEmitter;

// TODO java에서 큐에 담긴 메시지 꺼내와서 처리하는거 만들어야 함. 새 메시지가 왔음을 알려주지 않으므로 적절히 찾아가야함..ㅠㅠ
// TODO webworker-threads같은걸 끼얺나?

var LolClient = function(settings) {
  this.setting = settings;
  this.client = null;
  this.summoner = {};
  this.availableQueues = {};
  this.xmppClient = null;
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
      if(err) { callback(err.toString(), null); return; }
        self.client = rtmpClient;
       java.callMethod(rtmpClient, "connectAndLogin", function(err, results) {
         if(err) { callback(err.toString(), null); return; }
        var LoginDataPacket = JSON.parse(self.sendMessage("clientFacadeService", "getLoginDataPacketForUser", []).toString());
          self.summoner.rawData = LoginDataPacket.data.body.allSummonerData;
         self.getAvailableQueues();
         callback(null, self);
       });
  });
  this.xmppClient = require('./xmpp-chat');
  this.xmppClient.connect(this.setting);
}
LolClient.prototype.getAcctId = function() {
  if (this.client != null) {
    return java.callMethodSync(this.client, "getAccountID");
  } else {
    return -1;
  }
};

LolClient.prototype.sendMessage = function(destination, operation, object, callback) {
  if (this.client != null) {
    var newObject = java.newArray("java.lang.Object", object);

    var invokeId = java.callMethodSync(this.client, "invoke", destination, operation, newObject);
    if (callback) {
      java.callMethod(this.client, "getResult", invokeId, function(err, result) {
        callback(err, result);
      });
    } else {
      return java.callMethodSync(this.client, "getResult", invokeId);
    }
  }
  return "";
}

LolClient.prototype.attachToQueue = function() {
  // body...
};



LolClient.prototype.getAvailableQueues = function() {
  var rawData = this.sendMessage("matchmakerService", "getAvailableQueues", []).toString();
  this.availableQueues = require("./game-queue")(JSON.parse(rawData).data.body.array);
  // console.log(rawData);
  console.log(this.availableQueues);
};



LolClient.prototype.close = function() {
  if (this.client != null)
  {
    java.callMethodSync(this.client, "close");
    this.client = null;
  }
};
module.exports = LolClient;
