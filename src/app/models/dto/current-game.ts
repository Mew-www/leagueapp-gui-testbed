import {GameType} from "../../enums/game-type";
import {ChampionsContainer} from "./containers/champions-container";
import {CurrentGameParticipant} from "./current-game-participant";
import {BannedChampion} from "./banned-champion";

export class CurrentGame {

  public readonly game_id;
  public readonly game_type: GameType;
  public readonly game_start_time: Date;
  public readonly bans: Array<BannedChampion>;
  public readonly players: Array<CurrentGameParticipant>;
  public readonly looked_up_summoner_id;

  // https://developer.riotgames.com/api-methods/#spectator-v3/GET_getCurrentGameInfoBySummoner
  constructor(currentgame_json, looked_up_summoner_id,
              champions: ChampionsContainer) {

    this.game_id = currentgame_json.gameId;
    this.game_type = (function (queue_id) {
      switch (queue_id) {
        case 420:
          return GameType.SOLO_QUEUE;
        case 440:
          return GameType.FLEX_QUEUE;
        default:
          return GameType.UNKNOWN_UNDEFINED;
      }
    })(currentgame_json.gameQueueConfigId);
    this.game_start_time = new Date(currentgame_json.gameStartTime);
    this.bans = currentgame_json.bannedChampions.map(b => {
      return new BannedChampion(b, champions);
    });
    this.players = currentgame_json.participants.map(p => {
      return new CurrentGameParticipant(p, champions);
    });
    this.looked_up_summoner_id = looked_up_summoner_id;

  }
}