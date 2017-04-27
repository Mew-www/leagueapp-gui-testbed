export class GameRecord {

  // readonly using encapsulation
  private _raw_origin;
  get raw_origin() { return this._raw_origin; }

  constructor(game_json) {
    this._raw_origin = game_json;
  }
}