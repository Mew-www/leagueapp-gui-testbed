import {ChampionImages} from "./sub/champion-images";

export class Champion {

  public readonly id;
  public readonly name;
  public readonly images: ChampionImages;

  // https://developer.riotgames.com/api-methods/#static-data-v3/GET_getChampionList
  constructor(champion_json) {
    this.id = champion_json['id'];
    this.name = champion_json['name'];
    this.images = new ChampionImages(champion_json['ddragon_key']);
  }
}