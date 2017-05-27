export class GameRecord {

  public readonly raw_origin;

  // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatch
  // Only includes the json dump - parsed per usage in subclasses
  constructor(game_json) {
    this.raw_origin = game_json;
  }
}