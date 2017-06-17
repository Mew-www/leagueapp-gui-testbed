import {RankedTier} from "../../enums/ranked-tier";
import {GameType} from "../../enums/game-type";
import {LeagueSeries} from "./league-series";

export class LeaguePosition {

  public readonly queue: GameType;
  public readonly tier: RankedTier;
  public readonly sub_tier: number;
  public readonly league_points: number;
  public readonly wins: number;
  public readonly losses: number;
  public readonly in_series: boolean = false;
  public readonly series: LeagueSeries = null;

  constructor(league_position_json) {
    switch(league_position_json.queueType) {
      case 'RANKED_SOLO_5x5':
        this.queue = GameType.SOLO_QUEUE;
        break;

      case 'RANKED_FLEX_SR':
        this.queue = GameType.FLEX_QUEUE_5V5;
        break;

      case 'RANKED_FLEX_TT':
        this.queue = GameType.FLEX_QUEUE_3V3;
        break;

      default:
        this.queue = GameType.UNKNOWN_UNDEFINED;
        break;
    }

    switch(league_position_json.tier) {
      case 'BRONZE':
        this.tier = RankedTier.BRONZE;
        break;

      case 'SILVER':
        this.tier = RankedTier.SILVER;
        break;

      case 'GOLD':
        this.tier = RankedTier.GOLD;
        break;

      case 'PLATINUM':
        this.tier = RankedTier.PLATINUM;
        break;

      case 'DIAMOND':
        this.tier = RankedTier.DIAMOND;
        break;

      case 'MASTER':
        this.tier = RankedTier.MASTER;
        break;

      case 'CHALLENGER':
        this.tier = RankedTier.CHALLENGER;
        break;
    }

    switch(league_position_json.rank) {
      case 'I':
        this.sub_tier = 1;
        break;

      case 'II':
        this.sub_tier = 2;
        break;

      case 'III':
        this.sub_tier = 3;
        break;

      case 'IV':
        this.sub_tier = 4;
        break;

      case 'V':
        this.sub_tier = 5;
        break;
    }

    this.league_points = league_position_json.leaguePoints;
    this.wins = league_position_json.wins;
    this.losses = league_position_json.losses;

    if (league_position_json.hasOwnProperty('miniSeries')) {
      this.in_series = true;
      this.series = new LeagueSeries(league_position_json.miniSeries);
    }
  }
}