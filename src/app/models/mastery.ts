import {Champion} from "./champion";

export class Mastery {

  public readonly champion: Champion;
  // Level calculations
  public readonly level: Number;
  public readonly total_points: Number;
  public readonly points_since_last_level: Number = 0;
  public readonly points_until_next_level: Number = 0;
  public readonly tokens_earned_for_next_level: Number = 0;
  // Last time played in any queue
  public readonly last_play_time: Date;
  // S- or higher rank within same team this season?
  public readonly chest_acquired: boolean;

  constructor(mastery_json, champions_metadata: Array<Champion>) {
    this.champion = champions_metadata.filter(c => c.id === mastery_json.championId)[0];
    this.level = mastery_json.championLevel;
    this.total_points = mastery_json.championPoints;
    this.points_since_last_level = mastery_json.championPointsSinceLastLevel;
    this.points_until_next_level = mastery_json.championPointsUntilNextLevel;
    this.tokens_earned_for_next_level = mastery_json.tokensEarned;
    this.last_play_time = new Date(mastery_json.lastPlayTime); // epoch ms
    this.chest_acquired = mastery_json.chestGranted;
  }
}