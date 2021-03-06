var https = require('https');

var rtmpHosts = {
  na: 'prod.na2.lol.riotgames.com',
  euw: 'prod.eu.lol.riotgames.com',
  eune: 'prod.eun1.lol.riotgames.com',
  kr: 'prod.kr.lol.riotgames.com',
  br: 'prod.br.lol.riotgames.com',
  tr: 'prod.tr.lol.riotgames.com',
  ru: 'prod.ru.lol.riotgames.com',
  lan: 'prod.la1.lol.riotgames.com',
  las: 'prod.la2.lol.riotgames.com',
  oce: 'prod.oc1.lol.riotgames.com',
  pbe: 'prod.pbe1.lol.riotgames.com',
  tw: 'prodtw.lol.garenanow.com'
};

var loginQueueHosts = {
  na: 'lq.na2.lol.riotgames.com',
  euw: 'lq.eu.lol.riotgames.com',
  eune: 'lq.eun1.lol.riotgames.com',
  kr: 'https://lq.kr.lol.riotgames.com/',
  br: 'lq.br.lol.riotgames.com',
  tr: 'lq.tr.lol.riotgames.com',
  lan: 'lq.la1.lol.riotgames.com',
  las: 'lq.la2.lol.riotgames.com',
  oce: 'lq.oc1.lol.riotgames.com',
  pbe: 'lq.pbe1.lol.riotgames.com',
  tw: 'loginqueuetw.lol.garenanow.com'
};

var chatHosts = {
    na: 'chat.na1.lol.riotgames.com',
    euw: 'chat.eu.lol.riotgames.com',
    eune: 'chat.eun1.lol.riotgames.com',
    kr: 'chat.kr.lol.riotgames.com'
};

var Setting = function(options) {
  if (options.region) {
		this.host = rtmpHosts[options.region];
		this.lqHost = loginQueueHosts[options.region];
    this.chatHost = chatHosts[options.region];
    this.region = options.region;
	} else {
		this.host = this.options.host;
		this.lqHost = this.options.lqHost;
    this.chatHost = this.options.chatHost;

	}

	this.port = options.port || 2099;
	this.username = options.username;
	this.password = options.password;
	this.useGarena = options.useGarena || false;
	this.garenaToken = options.garenaToken || '';
  this.locale = 'ko_KR';
  this.clientVersion = "5.20.15_10_12_21_58";
  this.cdnImageHost = "http://ddragon.leagueoflegends.com/cdn/5.18.1/img/";
  this.debug = true;
}
module.exports = Setting;
