var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var LolClient = require("./lib/league-of-legend/client");
var Setting = require("./setting");
// Report crashes to our server.
require('crash-reporter').start();

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1699, height: 720});// ,  frame: false});



  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  ipc.on('client-connect', function(event, username, password) {
    var options = { region: "kr",
      username: username,
      password: password
    };
    var client = new LolClient(new Setting(options));
    client.connect(function(err, c) {
      if (err) {
        event.sender.send('client-connect-reply', err, null);
        return;
      }
      event.sender.send('client-connect-reply', null, c.getAcctId());
      lolClient = client;
    });
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
