import {ApiRoutes} from "../../../constants/api-routes";

export class SummonerSpellImages {

  public readonly square_url;

  constructor(ddragon_key) {
    this.square_url = ApiRoutes.SUMMONER_SPELL_URI(ddragon_key);
  }
}