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



ipc.on("change-friend-status", function(err, username, data) {
  if (err) { console.error(err); }
  console.log(username);
});
