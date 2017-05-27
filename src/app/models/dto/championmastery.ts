import {Champion} from "./champion";
import {ChampionsContainer} from "./containers/champions-container";

export class Championmastery {

  public readonly champion: Champion;
  public readonly level: Number;
  public readonly total_points: Number;
  public readonly points_since_last_level: Number = 0;
  public readonly points_until_next_level: Number = 0;
  public readonly tokens_earned_for_next_level: Number = 0;
  public readonly last_play_time: Date; // Last time played in any queue
  public readonly chest_acquired: boolean; // S- or higher rank within same team this season?

  // https://developer.riotgames.com/api-methods/#champion-mastery-v3/GET_getAllChampionMasteries
  constructor(champ_mastery_json, champions: ChampionsContainer) {
    this.champion = champions.getChampionById(champ_mastery_json.championId);
    this.level = champ_mastery_json.championLevel;
    this.total_points = champ_mastery_json.championPoints;
    this.points_since_last_level = champ_mastery_json.championPointsSinceLastLevel;
    this.points_until_next_level = champ_mastery_json.championPointsUntilNextLevel;
    this.tokens_earned_for_next_level = champ_mastery_json.tokensEarned;
    this.last_play_time = new Date(champ_mastery_json.lastPlayTime); // epoch ms
    this.chest_acquired = champ_mastery_json.chestGranted;
  }
}