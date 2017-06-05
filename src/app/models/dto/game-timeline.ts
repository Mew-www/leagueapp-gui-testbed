export class GameTimeline {

  public readonly raw_origin;

  // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatchTimeline
  // Only includes the json dump - parsed per usage in subclasses
  constructor(timeline_json) {
    this.raw_origin = timeline_json;
  }
}