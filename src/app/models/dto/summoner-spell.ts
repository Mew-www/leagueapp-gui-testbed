import {SummonerSpellImages} from "./sub/summoner-spell-images";

export class SummonerSpell {

  public readonly id;
  public readonly name;
  public readonly description;
  public readonly range;
  public readonly cooldown;
  public readonly images: SummonerSpellImages;

  // https://developer.riotgames.com/api-methods/#static-data-v3/GET_getSummonerSpellList
  constructor(summspell_json) {
    this.id          = summspell_json['id'];
    this.name        = summspell_json['name'];
    this.description = summspell_json['description'];
    this.range       = summspell_json['range'][0];
    this.cooldown    = summspell_json['cooldown'][0];
    this.images = new SummonerSpellImages(summspell_json['key']);
  }
}