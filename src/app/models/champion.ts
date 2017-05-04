import {ChampionImages} from "./champion-images";

export class Champion {

  public readonly id;
  public readonly name;
  public readonly images: ChampionImages;

  constructor(id, name, ddragon_name) {
    this.id = id;
    this.name = name;
    this.images = new ChampionImages(ddragon_name);
  }
}