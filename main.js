var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var LolClient = require("./lib/league-of-legend/client");
var Setting = require("./setting");
// Report crashes to our server.
require('crash-reporter').start();
var XmppChatClient = require('./lib/league-of-legend/xmpp-chat');
var xmppClient = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;
var lolClient = null;
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (lolClient) {
    lolClient.close();
    lolClient = null;
    console.log("정상 종료되었ㅅ브니다.");
  }
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1150, height: 720});// ,  frame: false});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  ipc.on('client-connect', function(event, username, password) {
    var options = { region: "kr",
      username: username,
      password: password
    };
    event.sender.send('client-connect-reply', null, 100);

    xmppClient = new XmppChatClient();
    xmppClient.event.on("requestSubscribe", function(jid) {
      console.log(jid);
    });
    xmppClient.event.on("changeFriendStatus", function(friend) {
      mainWindow.webContents.send("change-friend-status", friend);
    });
    xmppClient.connect(new Setting(options));

    /*
    var client = new LolClient(new Setting(options));
    client.connect(function(err, c) {
      if (err) {
        event.sender.send('client-connect-reply', err, null);
        return;
      }
      event.sender.send('client-connect-reply', null, c.getAcctId());
      lolClient = client;
    });*/
  });

  ipc.on('getSummoner', function(event, arg) {
    if (lolClient) {
      event.returnValue = lolClient.summoner;
    } else {
      event.returnValue = null;
    }
  });
  ipc.on('getAvailableQueues', function(event, arg) {
    if (lolClient) {
      event.returnValue = lolClient.availableQueues;
    } else {
      event.returnValue = null;
    }
  });

  ipc.on("getXMPPFriends", function(event, arg) {
    event.returnValue = xmppClient.getAllFriends();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    if (lolClient) {
      lolClient.close();
      lolClient = null;
      console.log("정상 종료되었ㅅ브니다.");
    }
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
