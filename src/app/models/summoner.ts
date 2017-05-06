import {SummonerIcon} from "./summoner-icon";

export class Summoner {

  public readonly region;
  public readonly id;
  public readonly icon: SummonerIcon;
  public current_name;

  constructor(region, id, name, icon_id) {
    this.region = region;
    this.id = id;
    this.icon = new SummonerIcon(icon_id);
    this.current_name = name;
  }

}