module.exports = function(availableQueuesData) {
  var queues = {
    kr : {
      "PVP" : {
        "클래식" : {
          "소환사의 협곡 - 5대5" : {
            "일반 - 편리한 팀 구성" : {},
            "일반 - 비공개 선택" : {},
            "일반 - 교차 선택" : {},
            "랭크 개인/2인전 - 교차선택" : {},
            "랭크 팀 게임 - 교차선택" : {}
          },
          "뒤틀린 숲 - 3대3" : {
            "일반 - 비공개 선택" : {},
            "랭크 팀 게임 - 교차 선택" : {}
          }
        },
        "도미니언" : {
          "수정의 상처 - 5대5" : {
            "일반 - 비공개 선택" : {},
            "일반 - 교차 선택" : {}
          }
        },
        "무작위 총력전" : {
          "칼바람 나락 - 5대5" : {
            "일반 게임 - 모두 무작위" : {}
          }
        },
        "전설의 포로 왕" : {
          "칼바람 나락 - 5대5" : {
            "특별 게임 모드 - 비공개 교차 선택" : {}
          }
        },
        "단일 챔피언: 미러 모드" : {
          "칼바람 나락 - 5대5" : {
            "특별 게임 모드 - 투표 선택" : {}
          }
        },
        "니가가라 하와이" : {
          "소환사의 협곡 - 5대5" : {
            "특별 게임 모드 - 보복 교차 선택" : {}
          }
        },
        "헥사 킬" : {
          "소환사의 협곡 - 6대6" : {
            "특별 게임 모드 - 비공개 선택" : {}
          }
        },
        "U.R.F 모드" : {
          "소환사의 협곡 - 5대5" : {
            "특별 게임 모드 - 비공개 교차 선택" : {}
          }
        }
      },
      "AI 상대 대전" : {
        "클래식" : {
          "소환사의 협곡 - 5대5" : {
            "입문" : {},
            "초보" : {},
            "중급" : {},
          },
          "뒤틀린 숲 - 3대3" : {
            "초보" : {},
            "중급" : {}
          }
        },
        "도미니언" : {
          "수정의 상처 - 5대5" : {
            "초보" : {},
            "중급" : {}
          }
        },
        "초토화 봇" : {
          "소환사의 협곡 - 5대5" : {
            "1" : {},
            "2" : {},
            "5" : {},
          },
        }
      },
      "사용자 설정" : {
        "일반" : {}
      }
    }
  };
  availableQueuesData.forEach(function(elem) {
    switch ( elem.cacheName ) {
      case "matching-queue-GROUP_FINDER-5x5-game-queue":
        queues.kr["PVP"]["클래식"]["소환사의 협곡 - 5대5"]["일반 - 편리한 팀 구성"] = elem;
      break;
      case "matching-queue-NORMAL-5x5-game-queue":
        queues.kr["PVP"]["클래식"]["소환사의 협곡 - 5대5"]["일반 - 비공개 선택"] = elem;
      break;
      case "matching-queue-NORMAL-5x5-draft-game-queue":
        queues.kr["PVP"]["클래식"]["소환사의 협곡 - 5대5"]["일반 - 교차 선택"] = elem;
      break;
      case "matching-queue-RANKED_SOLO-5x5-game-queue":
        queues.kr["PVP"]["클래식"]["소환사의 협곡 - 5대5"]["랭크 개인/2인전 - 교차선택"] = elem;
      break;
      case "matching-queue-RANKED_TEAM-5x5-game-queue":
        queues.kr["PVP"]["클래식"]["소환사의 협곡 - 5대5"]["랭크 팀 게임 - 교차선택"] = elem;
      break;

      case "matching-queue-NORMAL-3x3-game-queue":
        queues.kr["PVP"]["클래식"]["뒤틀린 숲 - 3대3"]["일반 - 비공개 선택"] = elem;
      break;
      case "matching-queue-RANKED_TEAM-3x3-game-queue":
        queues.kr["PVP"]["클래식"]["뒤틀린 숲 - 3대3"]["랭크 팀 게임 - 교차 선택"] = elem;
      break;

      case "matching-queue-ODIN-5x5-game-queue":
        queues.kr["PVP"]["도미니언"]["수정의 상처 - 5대5"]["일반 - 비공개 선택"] = elem;
      break;
      case "matching-queue-ODIN-5x5-draft-game-queue":
        queues.kr["PVP"]["도미니언"]["수정의 상처 - 5대5"]["일반 - 교차 선택"] = elem;
      break;

      case "matching-queue-ARAM-5x5-game-queue":
        queues.kr["PVP"]["무작위 총력전"]["칼바람 나락 - 5대5"]["일반 게임 - 모두 무작위"] = elem;
      break;

      case "matching-queue-KINGPORO-5x5-game-queue":
        queues.kr["PVP"]["전설의 포로 왕"]["칼바람 나락 - 5대5"]["특별 게임 모드 - 비공개 교차 선택"] = elem;
      break;

      case "matching-queue-ONEFORALL-5x5-game-queue":
        queues.kr["PVP"]["단일 챔피언: 미러 모드"]["칼바람 나락 - 5대5"]["특별 게임 모드 - 투표 선택"] = elem;
      break;

      case "matching-queue-BOT_INTRO-5x5-game-queue":
        queues.kr["AI 상대 대전"]["클래식"]["소환사의 협곡 - 5대5"]["입문"] = elem;
      break;
      case "matching-queue-BOT_EASY-5x5-game-queue":
        queues.kr["AI 상대 대전"]["클래식"]["소환사의 협곡 - 5대5"]["초보"] = elem;
      break;
      case "matching-queue-BOT_MEDIUM-5x5-game-queue":
        queues.kr["AI 상대 대전"]["클래식"]["소환사의 협곡 - 5대5"]["중급"] = elem;
      break;
    }
  });
  return queues;
}
