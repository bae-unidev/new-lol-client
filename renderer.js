var ipc = require("ipc");

function getSummonerData() {
  console.log(ipc.sendSync("getSummoner"));
  return ipc.sendSync("getSummoner");
}

function getAvailableQueues() {
  return ipc.sendSync("getAvailableQueues");
}

ipc.on("friend-presence", function(err, username) {
  if (err) { console.error(err); }
  console.log(username);
});
