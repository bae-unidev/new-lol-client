var java = require("java");
java.classpath.push("lolrtmpclient.jar");

java.classpath.push("smack-bosh-4.1.4.jar");
java.classpath.push("smack-compression-jzlib-4.1.4.jar");
java.classpath.push("smack-core-4.1.4.jar");
java.classpath.push("smack-debug-4.1.4.jar");
java.classpath.push("smack-debug-slf4j-4.1.4.jar");
java.classpath.push("smack-experimental-4.1.4.jar");
java.classpath.push("smack-extensions-4.1.4.jar");
java.classpath.push("smack-im-4.1.4.jar");
java.classpath.push("smack-java7-4.1.4.jar");
java.classpath.push("smack-jingle-old-4.1.4.jar");
java.classpath.push("smack-legacy-4.1.4.jar");
java.classpath.push("smack-resolver-dnsjava-4.1.4.jar");
java.classpath.push("smack-resolver-javax-4.1.4.jar");
java.classpath.push("smack-resolver-minidns-4.1.4.jar");
java.classpath.push("smack-sasl-javax-4.1.4.jar");
java.classpath.push("smack-sasl-provided-4.1.4.jar");
java.classpath.push("smack-tcp-4.1.4.jar");
java.classpath.push("xpp3-1.1.4c.jar");
java.classpath.push("xpp3_min-1.1.4c.jar");
java.classpath.push("xpp3_xpath-1.1.4c.jar");
java.classpath.push("jxmpp-util-cache-0.5.0-alpha2.jar");
java.classpath.push("jxmpp-core-0.5.0-alpha2.jar");
java.classpath.push("minidns-0.1.3.jar");



var EventEmitter = require('events').EventEmitter;
var xmlParser = require('xml2js').parseString;

var XMPP_STATUS = {
    online: "온라인",
    away: "자리 비움",
    dnd: "죽음",
    offline : "오프라인"
};

function XmppChatClient(setting) {
  var self = this;
  this.friends = {}; // jid : metadata
  this.client = null;
  java.newInstance("com.unidev.xmpp.XmppClient",
    setting.chatHost,
    setting.username,
    setting.password,
    function(err, xmppClient) {
      if(err) { self.emit("error", err); return; }
      xmppClient.ConnectedListener = java.newProxy('com.unidev.xmpp.ConnectedCallback', {
        Connected : function () {
          self.emit("online");
        }
      });
      xmppClient.StanzaProcessListener = java.newProxy('com.unidev.xmpp.StanzaCallback', {
        processPacket : function (type, data) {
          self.emit("stanza", type, data);
        }
      });
      xmppClient.ErrorListener = java.newProxy('com.unidev.xmpp.ErrorCallback', {
        OnError : function (message) {
          self.emit("error", message);
        }
      });
      xmppClient.DisconnectedListener = java.newProxy('com.unidev.xmpp.DisconnectedCallback', {
        OnDisconnected : function () {
          self.emit("close");
        }
      });
      java.callMethod(xmppClient, "ConnectAndLogin", function(err2, results) {
        if(err2) { self.emit("error", message); return; }
        self.client = xmppClient;
      });
    }
  );

  this.on("online", function() {
    console.log("online");
  });

  this.on('close', function () {
    console.error("close");
  });

  this.on('error', function(err) {
    console.error(err);
  });


  this.on('stanza', function(type, data) {
    if(type == "friend-add") {
      console.log(data.split(",")); // 친구목록임.
    } else if (type == "friend-presence") {
      console.log(data);
    }
    /*
    if (stanza.is("iq")) {
      for (var f in stanza.children[0].children) {
        var friend = stanza.children[0].children[f];
        self.friends[friend.attrs.jid] = {
          username : friend.attrs.name,
          status : XMPP_STATUS.offline,
          profileIcon : "",
          level : 0
         };
      }
    } else if (stanza.is("presence")) {
      if (stanza.attrs.type) {
        var jid = stanza.attrs.from.split('/')[0];
        if (stanza.attrs.type === 'unavailable' || stanza.attrs.type === 'invisible') { // log out
          self.friends[jid].status = XMPP_STATUS.offline;
          self.emit("onChangeFriendStatus", self.friends[jid]);
        } else if (stanza.attrs.type === 'available') { // login
          var friendInfo = null;
          self.friends[jid].status = XMPP_STATUS.online;
          xmlParser(stanza.children[1].children[0], function (err, result) {
              friendInfo = (result && result.body) ? result.body : body;
          });
          console.log(friendInfo);
          console.log(self.friends[jid]);
          self.emit("onChangeFriendStatus", self.friends[jid]);
        }
      }
    }*/
    // TODO chating...
    //console.log(type);
    //console.log(data);

  });

  console.log(this);
}

XmppChatClient.prototype = EventEmitter.prototype;

 module.exports = XmppChatClient;
