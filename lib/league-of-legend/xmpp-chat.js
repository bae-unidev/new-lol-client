var Xmpp = require('node-xmpp');
var EventEmitter = require('events').EventEmitter;

var STATUS = {
    online: "온라인",
    away: "자리 비움",
    dnd: "죽음",
    offline : "오프라인"
};

function XmppChatClient(username, password, settings) {
  var self = this;
  this.connection = new Xmpp.Client({
    jid : username + "@pvp.net/xiff",
    password : "AIR_" + password,
    host : settings.chatHost,
    port : 5223,
    lagacySSL : true
  });
  this.connection.on('close', function () {
    self.emit('close');
  });

  this.connection.on('error', function(err) {
    self.emit('close');
  });

  this.connection.on('online', function(data) {
      console.log(data);
      conn.send(new Xmpp.Element('presence'));
      self.emit('online', data);
      if (self.connection.connection.socket) {
          self.connection.connection.socket.setTimeout(0);
          self.connection.connection.socket.setKeepAlive(true, 10000);
      }
      self.getRoster();
  });

  this.connection.on('stanza', function(stanza) {
    // TODO friends... chating...
    console.log(stanza);
  }
}

XmppChatClient.prototype = EventEmitter.prototype;

XmppChatClient.prototype.getRoster = function () {
  var roster = new xmpp.Element('iq', { id: 'roster_0', type: 'get' });
  roster.c('query', { xmlns: 'jabber:iq:roster' });
  this.connection.send(roster);
}

XmppChatClient.prototype.sendMessage = function (jid, message) {
  jid += '/xiff';
  var stanza = new Xmpp.Element('message', { to: jid, type: 'chat' });
  stanza.c('body').t(message);
  this.connection.send(stanza);
}

module.exports = XmppChatClient;
