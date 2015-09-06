var rtmp = require('namf/rtmp');

var ASObject = require('namf/messaging').ASObject;

var RTMPClient = rtmp.RTMPClient;
var RTMPCommand = rtmp.RTMPCommand;

var uuid = require('node-uuid');

var Packets = function() {
  this.ConnectPacket = {};
  this.ConnectPacket.generate = function(setting) {
    var AppObject = {
      app: '',
      flashVer: 'WIN 10,1,85,3',
      swfUrl: 'app:/mod_ser.dat',
      tcUrl: 'rtmps://' + setting.host,// + ':2099',
      objectEncoding: 3
    };
    var CommandObject = new ASObject();
    CommandObject.name = 'flex.messaging.messages.CommandMessage';
    CommandObject.object = {
      operation: 5,
      correlationId: '',
      timestamp: 0,
      clientId: null,
      timeToLive: 0,
      messageId: uuid().toUpperCase(),
      destination: '',
      headers: { DSMessagingVersion: 1, DSId: 'my-rtmps' },
      body: {}
    };
    var cmd = new RTMPCommand(0x14, 'connect', null, AppObject, [false, 'nil', '', CommandObject]);
    return cmd;
  }
  this.LoginPacket = {};
  this.LoginPacket.generate = function(settings) {
    var settings = settings;
    var generateHeaders = function() {
    	var headers = new ASObject();
    	headers.name = '';
    	headers.object = {
    		DSId: settings.dsid,
    		DSRequestTimeout: 60,
    		DSEndpoint: 'my-rtmps'
    	};
    	headers.encoding = 2;
    	return headers;
    };

    var generateBody = function() {
    	var partner;
    	var userName;
    	if (settings.garenaToken) {
    		username = settings.userId;
    		partner = '8393 ' + settings.garenaToken;
    	} else {
    		username = settings.username;
    		partner = null;
    	}
    	var body = new ASObject();
    	body.name = 'com.riotgames.platform.login.AuthenticationCredentials';
    	body.keys = ['oldPassword', 'password', 'authToken', 'locale', 'partnerCredentials', 'ipAddress', 'ipAddress', 'domain', 'username', 'clientVersion', 'securityAnswer', 'operatingSystem'];
    	body.object = {
    		oldPassword: null,
    		password: settings.password,
    		authToken: settings.queueToken,
    		locale: settings.locale,
    		partnerCredentials: partner,
    		ipAddress: settings.getIpAddress(),
    		domain: 'lolclient.lol.riotgames.com',
    		username: username,
    		clientVersion: settings.clientVersion,
    		securityAnswer: null,
        operatingSystem : "darwin-ubuntu-14.04"
    	};
    	body.encoding = 0;
    	return body;
    };
    var object = new ASObject();
    object.name = 'flex.messaging.messages.RemotingMessage';
    object.keys = ['operation', 'source', 'timestamp', 'clientId', 'timeToLive', 'messageId', 'destination', 'headers', 'body'];
    object.object = {
      operation: 'login',
      source: null,
      timestamp: 0,
      clientId: null,
      timeToLive: null,
      messageId: uuid().toUpperCase(),
      destination: 'loginService',
      headers: generateHeaders(),
      body: [generateBody()]
    };
    object.encoding = 0;

    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  }
  this.AuthPacket = {};
  this.AuthPacket.generate = function(settings) {
    var generateHeaders = function(settings) {
    	var headers = new ASObject();
    	headers.name  = '';
    	headers.object = {
    		DSId: settings.dsid,
    		DSRequestTimeout: 60,
    		DSEndpoint: 'my-rtmps'
    	};
    	headers.encoding = 2;
    	return headers;
    };

    var str;
    if (!settings.garenaToken) {
      str = settings.username + ':' + settings.authToken;
    } else {
      str = settings.userId + ':' + settings.authToken;
    }

    var objectBody = new Buffer(str, 'utf8').toString('base64');
    var object = new ASObject();

    object.name = 'flex.messaging.messages.CommandMessage';
    object.keys = ['operation', 'correlationId', 'timestamp', 'clientId', 'timeToLive', 'messageId', 'destination', 'headers', 'body'];
    object.object = {
      operation: 8,
      correlationId: '',
      timestamp: 0,
      clientId: null,
      timeToLive: 0,
      messageId: uuid().toUpperCase(),
      destination: 'auth',
      headers: generateHeaders(settings),
      body: objectBody
    };
    object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  }
  this.GNPacket = {};
  this.GNPacket.generate = function(settings) {
    	var headers = new ASObject();
    	headers.name = '';
    	headers.object = {
    		DSId: settings.dsid,
    		DSSSubtopic: 'gn-' + settings.acctId,
    		DSEndpoint: 'my-rtmps'
    	};
    	headers.encoding = 2;

  	var object = new ASObject();
  	object.name = 'flex.messaging.messages.CommandMessage';
  	object.keys = ['operation', 'correlationId', 'timestamp', 'clientId', 'timeToLive', 'messageId', 'destination', 'headers', 'body'];
  	object.object = {
  		operation: 8,
  		correlationId: '',
  		timestamp: 0,
  		clientId: 'gn-' + settings.acctId,
  		timeToLive: 0,
  		messageId: uuid().toUpperCase(),
  		destination: 'messagingDestination',
  		headers: headers,
  		body: null
  	};
  	object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  };
  this.CNPacket = {};
  this.CNPacket.generate = function(settings) {
    var headers = new ASObject();
  	headers.name = '';
  	headers.object = {
  		DSId: settings.dsid,
  		DSSSubtopic: 'cn-' + settings.acctId,
  		DSEndpoint: 'my-rtmps'
  	};
  	headers.encoding = 2;
    var object = new ASObject();
  	object.name = 'flex.messaging.messages.CommandMessage';
  	object.keys = ['operation', 'correlationId', 'timestamp', 'clientId', 'timeToLive', 'messageId', 'destination', 'headers', 'body'];
  	object.object = {
  		operation: 8,
  		correlationId: '',
  		timestamp: 0,
  		clientId: 'cn-' + settings.acctId,
  		timeToLive: 0,
  		messageId: uuid().toUpperCase(),
  		destination: 'messagingDestination',
  		headers: headers,
  		body: null
  	};
  	object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
  	return cmd;
  };
  this.BCPacket = {};
  this.BCPacket.generate = function(settings) {
    var headers = new ASObject();
    headers.name = '';
    headers.object = {
      DSId: settings.dsid,
      DSSSubtopic: 'bc',
      DSEndpoint: 'my-rtmps'
    };
    headers.encoding = 2;
    var object = new ASObject();
    object.name = 'flex.messaging.messages.CommandMessage';
    object.keys = ['operation', 'correlationId', 'timestamp', 'clientId', 'timeToLive', 'messageId', 'destination', 'headers', 'body'];
    object.object = {
      operation: 8,
      correlationId: '',
      timestamp: 0,
      clientId: 'bc-' + settings.acctId,
      timeToLive: 0,
      messageId: uuid().toUpperCase(),
      destination: 'messagingDestination',
      headers: headers,
      body: null
    };
    object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  }
  this.GetLoginUserDataPacket = {};
  this.GetLoginUserDataPacket.generate = function(settings) {
    var headers = new ASObject();
    headers.name = '';
    headers.object = {
      DSId: settings.dsid,
      DSRequestTimeout: 60,
      DSEndpoint: 'my-rtmps'
    };
    headers.encoding = 2;
    var object = new ASObject();
    object.name = 'flex.messaging.messages.RemotingMessage';
    object.keys = ['source', 'operation', 'timestamp', 'messageId', 'clientId', 'timeToLive', 'destination', 'headers', 'body'];
    object.object = {
      operation: 'getLoginDataPacketForUser',
      source: null,
      timestamp: 0,
      clientId: null,
      timeToLive: 0,
      messageId: uuid().toUpperCase(),
      destination: 'clientFacadeService',
      headers: headers,
      body: null
    };
    console.log(object.object.messageId, settings.acctId);
    object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  }
  this.LookUpPacket = {};
  this.LookUpPacket.generate = function(settings, name) {
    var headers = new ASObject();
    headers.name = '';
    headers.object = {
      DSId: settings.dsid,
      DSRequestTimeout: 60,
      DSEndpoint: 'my-rtmps'
    };
    headers.encoding = 2;
    var object = new ASObject();
  	object.name = 'flex.messaging.messages.RemotingMessage';
  	object.keys = ['source', 'operation', 'timestamp', 'messageId', 'clientId', 'timeToLive', 'body', 'destination', 'headers'];
  	object.object = {
  		operation: 'getSummonerByName',
  		source: null,
  		timestamp: 0,
  		clientId: settings.clientId,
  		timeToLive: 0,
  		messageId: uuid().toUpperCase(),
  		destination: 'summonerService',
  		headers: headers,
  		body: [name]
  	};
  	object.encoding = 0;
    var cmd = new RTMPCommand(0x11, null, null, null, [object]);
    return cmd;
  };




  return this;
};

module.exports = Packets();
/*


var LoginPacket = lolPackets.LoginPacket;
this.options.dsid = result.args[0].id;
var cmd = new RTMPCommand(0x11, null, null, null, [new LoginPacket(this.options).generate(this.options.version)]);


this.options.authToken = result.args[0].body.object.token;
var AuthPacket = lolPackets.AuthPacket;
var cmd = new RTMPCommand(0x11, null, null, null, [new AuthPacket(this.options).generate()]);

var GNPacket = lolPackets.GNPacket;
var cmd = new RTMPCommand(0x11, null, null, null, [new GNPacket(this.options).generate(this.options.acctId)]);
*/
