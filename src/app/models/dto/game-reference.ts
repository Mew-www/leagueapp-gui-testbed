import {Champion} from "./champion";
import {GameType} from "../../enums/game-type";
import {GameRecordPersonalised} from "../game-record-personalised";
import {ChampionsContainer} from "./containers/champions-container";

export class GameReference {

  public readonly game_id;
  public readonly game_start_time: Date;
  public readonly chosen_champion: Champion;
  public readonly game_type: GameType;
  public readonly presumed_lane;

  public game_details: GameRecordPersonalised = null;

  // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatchlist
  constructor(altered_game_ref_json, champions: ChampionsContainer) {
    this.game_id = altered_game_ref_json.game_id;
    this.game_start_time = new Date(altered_game_ref_json.timestamp);
    this.chosen_champion = champions.getChampionById(altered_game_ref_json.chosen_champion_id);
    this.game_type = altered_game_ref_json.game_type;
    this.presumed_lane = altered_game_ref_json.lane;
  }
}