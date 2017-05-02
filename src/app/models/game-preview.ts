import {Champion} from "./champion";
import {GameType} from "../enums/game-type";

export class GamePreview {

  public readonly game_id;
  public readonly game_start_time: Date;
  public readonly chosen_champion: Champion;
  public readonly game_type: GameType;

  constructor(game_preview_json, champions_metadata: Array<Champion>) {
    this.game_id = game_preview_json.match_id;
    this.game_start_time = new Date(game_preview_json.timestamp);
    this.chosen_champion = champions_metadata.filter(c => c.id === game_preview_json.chosen_champion_id)[0];
    this.game_type = game_preview_json.game_type;
  }
}