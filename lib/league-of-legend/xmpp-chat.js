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
      self.getRoster();
      conn.send(new xmpp.Element('presence'));

      // keepalive
      if (self.conn.connection.socket) {
        self.conn.connection.socket.setTimeout(0);
        self.conn.connection.socket.setKeepAlive(true, 10000);
      }

    });

    conn.on('stanza', function (stanza) {
      if (stanza.is("iq")) {
        console.log(stanza.children[0].children);
        for (var f in stanza.children[0].children) {
          var friend = stanza.children[0].children[f];
          self.friends[friend.attrs.jid] = {
            username : friend.attrs.name,
            status : XMPP_STATUS.offline,
            profileIcon : "",
            level : 0,
            message : ""
           };
           self.event.emit("changeFriendStatus", self.friends[friend.attrs.jid]);
        }
        console.log(self.friends);
      } else if (stanza.is("presence")) {
        var jid = stanza.attrs.from.split('/')[0];
        if (stanza.attrs.type) {
          if (stanza.attrs.type === 'unavailable' || stanza.attrs.type === 'invisible') { // log out
            self.friends[jid].status = XMPP_STATUS.offline;
            self.event.emit("changeFriendStatus", self.friends[jid]);
          } else if (stanza.attrs.type === 'subscribe') {
            self.event.emit("requestSubscribe", stanza.attrs.from);
            console.log(stanza);
          }
        } else { // login
          console.log(stanza.children);
          var status = stanza.children.find(function(child) {
            return (child.name == "status")
          });
          if (status) {
            self.friends[jid].status = XMPP_STATUS.online;
            xmlParser(status.children[0], function (err, result) {
              var friendInfo = (result && result.body) ? result.body : body;
              self.friends[jid].profileIcon = friendInfo.profileIcon[0];
              self.friends[jid].status = friendInfo.gameStatus[0];
              self.friends[jid].message = friendInfo.statusMsg[0];
            });
            // TODO 합치기 작업
            console.log(self.friends[jid]);
            self.event.emit("changeFriendStatus", self.friends[jid]);
          }
        }
      }
    });
  };

  self.getAllFriends = function () {
    return self.friends;
  };
}
