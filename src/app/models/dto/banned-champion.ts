import {Champion} from "./champion";
import {ChampionsContainer} from "./containers/champions-container";

export class BannedChampion {
  public readonly pick_turn;
  public readonly team_id;
  public readonly champion: Champion;

  // https://developer.riotgames.com/api-methods/#spectator-v3/GET_getCurrentGameInfoBySummoner
  constructor(ban_json, champions: ChampionsContainer) {
    this.pick_turn = ban_json.pickTurn;
    this.team_id = ban_json.teamId;
    this.champion = champions.getChampionById(ban_json.championId);
  }
}