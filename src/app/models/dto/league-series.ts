export class LeagueSeries {

  public readonly wins: number;
  public readonly losses: number;
  public readonly target: number;
  public readonly progress: string;

  constructor(series_json) {
    this.wins = series_json.wins;
    this.losses = series_json.losses;
    this.target = series_json.target;
    this.progress = series_json.progress; // E.g. "WWLNN" -> Win Win Lose None None
  }
}