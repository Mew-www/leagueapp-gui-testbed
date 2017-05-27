import {SummonerIcon} from "./sub/summoner-icon";

export class Summoner {

  public readonly region;
  public readonly id;
  public readonly account_id;
  public readonly icon: SummonerIcon;
  public current_name;

  // https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName
  constructor(region, id, account_id, name, icon_id) {
    this.region = region;
    this.id = id;
    this.account_id = account_id;
    this.icon = new SummonerIcon(icon_id);
    this.current_name = name;
  }

}