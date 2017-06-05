import {SummonerSpell} from "../summoner-spell";

export class SummonerspellsContainer {

  private _summonerspells_by_id = {};

  constructor(summonerspells_api_json) {
    Object.keys(summonerspells_api_json).forEach(key => {
      let summonerspell_json = summonerspells_api_json[key];
      this._summonerspells_by_id[summonerspell_json['id']] = new SummonerSpell(summonerspell_json);
    });
  }

  public getSummonerspellById(id): SummonerSpell {
    if (id in this._summonerspells_by_id) {
      return this._summonerspells_by_id[id];
    }
    return new SummonerSpell({
      'id': -1,
      'name': "UnknownSummonerspell"+id,
      'description': "",
      'range': [0],
      'cooldown': [0],
      'key': "404"
    });
  }
}