var ipc = require("ipc");

function getSummonerData() {
  return ipc.sendSync("getSummoner");
}

function getAvailableQueues() {
  return ipc.sendSync("getAvailableQueues");
}

function getXMPPFriends() {
  return ipc.sendSync("getXMPPFriends");
}

ipc.on("friend-presence", function(err, username) {
  if (err) { console.error(err); }
  console.log(username);
});
