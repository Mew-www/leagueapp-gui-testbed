import {GameType} from "../../enums/game-type";
import {ChampionsContainer} from "./containers/champions-container";
import {CurrentGameParticipant} from "./current-game-participant";
import {BannedChampion} from "./banned-champion";
import {SummonerspellsContainer} from "./containers/summonerspells-container";

export class CurrentGame {

  public readonly game_id;
  public readonly game_type: GameType;
  public readonly game_start_time: Date;
  public readonly bans: Array<BannedChampion>;
  public readonly allies: Array<CurrentGameParticipant>;
  public readonly enemies: Array<CurrentGameParticipant>;
  public readonly looked_up_summoner;

  // https://developer.riotgames.com/api-methods/#spectator-v3/GET_getCurrentGameInfoBySummoner
  constructor(currentgame_json, looked_up_summoner,
              champions: ChampionsContainer, summonerspells: SummonerspellsContainer) {

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
    let ally_team_id = currentgame_json.participants.find(p => p.summonerId === looked_up_summoner.id).teamId;
    this.allies = currentgame_json.participants
      .filter(p => p.teamId === ally_team_id)
      .map(p => {
        return new CurrentGameParticipant(p, champions, summonerspells);
      });
    this.enemies = currentgame_json.participants
      .filter(p => p.teamId !== ally_team_id)
      .map(p => {
        return new CurrentGameParticipant(p, champions, summonerspells);
      });
    this.looked_up_summoner = looked_up_summoner;

  }
}