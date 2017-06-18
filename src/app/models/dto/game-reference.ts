import {Champion} from "./champion";
import {GameType} from "../../enums/game-type";
import {GameRecordPersonalised} from "../game-record-personalised";
import {ChampionsContainer} from "./containers/champions-container";
import {GameTimelinePersonalised} from "../game-timeline-personalised";

export class GameReference {

  public readonly game_id;
  public readonly game_start_time: Date;
  public readonly chosen_champion: Champion;
  public readonly game_type: GameType;
  public readonly presumed_lane;
  public game_details: GameRecordPersonalised = null;
  public game_timeline: GameTimelinePersonalised = null;

  // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatchlist
  constructor(game_ref_json, champions) {
    this.game_id = game_ref_json.gameId;
    this.game_start_time = new Date(game_ref_json.timestamp);
    this.chosen_champion = champions.getChampionById(game_ref_json.champion);
    this.game_type =((queue_const: number) => {
      switch (queue_const) {
        case 440:
          return GameType.FLEX_QUEUE_5V5;
        case 420:
          return GameType.SOLO_QUEUE;
        default:
          return GameType.UNKNOWN_UNDEFINED;
      }
    })(game_ref_json.queue);
    if (game_ref_json.lane !== 'BOTTOM') {
      this.presumed_lane = game_ref_json.lane;
    } else {
      this.presumed_lane = game_ref_json.role === 'DUO_CARRY' ? 'BOTTOM' : 'SUPPORT';
    }
  }
}