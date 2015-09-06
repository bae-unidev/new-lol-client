var LoginDataPacketMetaData = {
  name : "com.riotgames.platform.clientfacade.domain.LoginDataPacket",
  keys : ["restrictedGamesRemainingForRanked", "playerStatSummaries",
  "restrictedChatGamesRemaining", "minutesUntilShutdown",
  "minor", "maxPracticeGameSize", "summonerCatalog",
  "ipBalance", "reconnectInfo", "languages",
  "simpleMessages", "allSummonerData", "customMinutesLeftToday",
  "platformGameLifecycleDTO", "coOpVsAiMinutesLeftToday", "bingeData",
  "inGhostGame", "leaverPenaltyLevel", "bingePreventionSystemEnabledForClient",
  "pendingBadges", "broadcastNotification", "minutesUntilMidnight", "timeUntilFirstWinOfDay",
  "coOpVsAiMsecsUntilReset", "clientSystemStates", "bingeMinutesRemaining", "pendingKudosDTO",
  "leaverBusterPenaltyTime", "platformId", "matchMakingEnabled", "minutesUntilShutdownEnabled",
  "rpBalance", "gameTypeConfigs", "bingeIsPlayerInBingePreventionWindow", "minorShutdownEnforced",
  "competitiveRegion", "customMsecsUntilReset"],
  create : function() {
    var result = {};
    for (var i=0;i<this.keys.length;i++) {
      result[this.keys[i]] = null;
    }
    return result;
  }
}

module.exports = LoginDataPacketMetaData;
