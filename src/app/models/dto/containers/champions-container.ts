import {Champion} from "../champion";

export class ChampionsContainer {

  private _champions_by_id = {};

  constructor(champions_api_json) {
    champions_api_json.forEach(champion_json => {
      this._champions_by_id[champion_json.id] = new Champion(champion_json);
    });
  }

  public getChampionById(id) {
    if (id in this._champions_by_id) {
      return this._champions_by_id[id];
    }
    return new Champion({
      'id': -1,
      'name': "UnknownChampion"+id,
      'ddragon_key': "404"
    })
  }

  public listChampions() {
    return Object.keys(this._champions_by_id).map(id => this._champions_by_id[id]);
  }

}