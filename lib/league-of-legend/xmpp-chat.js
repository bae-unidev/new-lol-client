var xmpp = require('node-xmpp');
var EventEmitter = require('events').EventEmitter;
var xmlParser = require('xml2js').parseString;

module.exports = LolChatClient;

var XMPP_STATUS = {
    online: "온라인",
    away: "자리 비움",
    dnd: "죽음",
    offline : "오프라인"
};

module.exports.XMPP_STATUS = XMPP_STATUS;

function LolChatClient() {
  var conn;
  var self = this;
  self.friends = {};
  self.event = new EventEmitter();
  self.setPresence = function (show, status) {

  };

  self.getRoster = function () {
    var roster = new xmpp.Element('iq', { id: 'roster_0', type: 'get' });
    roster.c('query', { xmlns: 'jabber:iq:roster' });
    conn.send(roster);
  };

  self.connect = function (setting) {
    conn = new xmpp.Client({
      jid: setting.username + '@pvp.net/xiff',
      password: "AIR_" + setting.password,
      host: setting.chatHost,
      port: 5223,
      legacySSL: true
    });

    self.conn = conn;

    conn.on('close', function () {
      console.log('close');
    });

    conn.on('error', function (err) {
      console.error(err);
    });

    conn.on('online', function (data) {
      console.log(data);
      conn.send(new xmpp.Element('presence'));

      // keepalive
      if (self.conn.connection.socket) {
        self.conn.connection.socket.setTimeout(0);
        self.conn.connection.socket.setKeepAlive(true, 10000);
      }

      self.getRoster();
    });

    conn.on('stanza', function (stanza) {
      if (stanza.is("iq")) {
        for (var f in stanza.children[0].children) {
          var friend = stanza.children[0].children[f];
          self.friends[friend.attrs.jid] = {
            username : friend.attrs.name,
            status : XMPP_STATUS.offline,
            profileIcon : "",
            level : 0,
            message : ""
           };
        }
        console.log(self.friends);
      } else if (stanza.is("presence")) {
        if (stanza.attrs.type) {
          var jid = stanza.attrs.from.split('/')[0];
          if (stanza.attrs.type === 'unavailable' || stanza.attrs.type === 'invisible') { // log out
            self.friends[jid].status = XMPP_STATUS.offline;
            self.event.emit("onChangeFriendStatus", self.friends[jid]);
          } else if (stanza.attrs.type === 'available') { // login
            var friendInfo = null;
            self.friends[jid].status = XMPP_STATUS.online;
            xmlParser(stanza.children[1].children[0], function (err, result) {
                friendInfo = (result && result.body) ? result.body : body;
            });
            console.log(friendInfo);
            console.log(self.friends[jid]);
            self.event.emit("onChangeFriendStatus", self.friends[jid]);
          } else if (stanza.attrs.type === 'subscribe') {
            self.event.emit("requestSubscribe", stanza.attrs.from);
            console.log(stanza);
          }
        }
      }
    });
  };

  self.getAllFriends = function () {
    return self.friends;
  };
}
