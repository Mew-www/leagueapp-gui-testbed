import {ApiRoutes} from "../../../constants/api-routes";

export class ChampionImages {

  public readonly square_url;

  constructor(ddragon_key) {
    this.square_url = ApiRoutes.CHAMPION_SQUARE_URI(ddragon_key);
  }
}