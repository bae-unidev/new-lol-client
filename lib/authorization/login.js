var https = require('https');
var tls = require('tls');
var rtmp = require('namf/rtmp');

var RTMPClient = rtmp.RTMPClient;
var RTMPCommand = rtmp.RTMPCommand;
var Packets = require("../packets");

var Login = function(lolClient) {
	var client = lolClient;
	var _callback = {};
	var self = this;
	this.getAuthKey = function(host, username, password, garenaToken, callback) {
		console.log(host);
		var data;
		var url = "/login-queue/rest/queue/authenticate";

		if (garenaToken) {
	    var nomalizeToken = function(token) {
	    	return token.toString().replace('/', '%2F').replace('+', '%2B').replace('=', '%3D');
	    };
			data = "payload=8393%20" + nomalizeToken(garenaToken);
		} else {
			data = "payload=user%3D" + username + "%2Cpassword%3D" + password;
		}
		console.log(data);
		var options = {
			host: host,
			port: 443,
			path: url,
			method: 'POST',
			requestCert: false,
			rejectUnauthorize: false
		};

		var req = https.request(options, function (res) {
			res.on('data', function(data) {
				var response = JSON.parse(data.toString('utf-8'));
				callback(null, response);
			});
		});

		req.on('error', function(err) {
			callback(err);
		});

		req.end(data);
	};
	this.connect = function(callback) {
		self._callback = callback;
		self.checkLoginQueue(function(err, token) {
			if (err) {
				console.log(err);
			}
			self.rtmpConnect(function(err, stream) {
				console.log('stream connected');
				client.stream = stream;
				self.setupRTMP();
			});
		});
	};

	this.checkLoginQueue = function(callback) {
		self.getAuthKey(client.setting.lqHost, client.setting.username, client.setting.password, client.setting.garenaToken, function(err, response) {
			if (err) {
				console.log("getAuthKey Failed");
			}
			if (!response.token) {
				if (response.status === "BUSY") {
					return console.log("Server too busy right now.");
				} else if (response.status === "FAILED") {
					return console.log(response);
				}
				var queue_name = response.champ;
				var rate = response.rate;
				var delay = response.delay;
				var node = response.node;
				var id = 0;
				var cursor = 0;
				for (var i = 0; i < response.tickers.length; i++){
					if (response.tickers[i].node == node) {
						id = response.tickers[i].id;
						cursor = response.tickers[i].current;
					}
				}
				console.log("In login queue. #" + (id - cursor) + " in line.");
				setTimeout(function() {
					self.checkLoginQueue(function(err, token) {
						if (err) {
							console.log(err);
						}
						self.rtmpConnect(function(err, stream) {
							console.log('stream connected');
							client.stream = stream;
							self.setupRTMP();
						});
					});
				}, delay);
			} else {
				if (client.setting.debug) {
					console.log("Login Queue Response: ", response);
				}
				client.setting.queueToken = response.token;
				if (client.setting.garenaToken) {
					client.setting.userId = response.user;
				}
				callback(null, client.setting.queueToken);
			}
		});
	}
	this.rtmpConnect = function(callback) {
		var stream = tls.connect(client.setting.port, client.setting.host, function() {
			client.rtmp = new RTMPClient(stream);
			client.rtmp.handshake(function(err) {
				if (err) {
					stream.destroy();
				} else {
					self.performNetConnect();
				}
			});
		});
		stream.on('error', function() {
			stream.destroySoon();
		});
	};

	this.performNetConnect = function() {
		var cmd = Packets.ConnectPacket.generate(client.setting);
		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				console.log('NetConnect failed');
					client.stream.destroy();
				} else {
				console.log('NetConnect success');
					self.performLogin(result);
			}
		});
	};

	this.performLogin = function(result) {
		client.setting.dsid = result.args[0].id;
		console.log(result)
		var cmd = Packets.LoginPacket.generate(client.setting);
		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				client.stream.destroy();
			} else {
				client.setting.clientId = result.args[0].clientId.toString('hex');
				self.performAuthentication(result);
			}
		});
	};
	this.performAuthentication = function(result) {
		client.setting.authToken = result.args[0].body.object.token;
		client.setting.acctId = result.args[0].body.object.accountSummary.object.accountId.value;
		console.log(result.args[0].body.object);
		var cmd = Packets.AuthPacket.generate(client.setting);

		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				console.log("Session Authentication Failed");
				client.stream.destroy();
			} else {
				console.log("Session Authentication Success");
				self.subscribeGN(result);
			}
		});
	};
	this.subscribeGN = function(result) {
		console.log(result);
		var cmd = Packets.GNPacket.generate(client.setting);
		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				if (client.setting.debug) { console.log("GN Subscription Failed"); }
				client.stream.destroy();
			} else {
				if (client.setting.debug) { console.log("GN Subscription Success"); }
				self.subscribeCN(result);
			}
		});
	};
	this.subscribeCN = function(result) {
		console.log(result);
		var cmd = Packets.CNPacket.generate(client.setting);
		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				if (client.setting.debug) { console.log("CN Subscription Failed"); }
				client.stream.destroy();
			} else {
				if (client.setting.debug) { console.log("CN Subscription Success"); }
				self.subscribeBC(result);
			}
		});
	};
	this.subscribeBC = function(result) {
		var cmd = Packets.BCPacket.generate(client.setting);
		client.rtmp.send(cmd, function(err, result) {
			if (err) {
				if (client.setting.debug) { console.log("BC Subscription Failed"); }
				client.stream.destroy();
			} else {
				if (client.setting.debug) { console.log("BC Subscription Success"); }
				self.getLoginUserData();
			}
		});

	}
	this.getLoginUserData = function() {
		console.log(client.setting)
		var cmd = Packets.GetLoginUserDataPacket.generate(client.setting, "쓰레쉬장인김지완");
		client.rtmp.send(cmd, function(err, result) {
			if (!err){
				console.log("Success");
				self._callback(result);
			} else {
				client.stream.destroy();
			}
		});
	}




	return this;
}
module.exports = Login;
