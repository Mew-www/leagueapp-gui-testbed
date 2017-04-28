import {SummonerIcon} from "./summoner-icon";

export class Summoner {

  public readonly id;
  public readonly icon: SummonerIcon;

  public current_name;

  constructor(id, name, icon_id) {
    this.id = id;
    this.icon = new SummonerIcon(icon_id);
    this.current_name = name;
  }

}