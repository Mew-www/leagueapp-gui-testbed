import {SummonerIcon} from "./summoner-icon";
export class Summoner {

  // Readonly using encapsulation
  private _id;
  private _icon: SummonerIcon;
  public get id() { return this._id; }
  public get icon() { return this._icon; }
  public current_name;

  constructor(id, name, icon_id) {
    this._id = id;
    this._icon = new SummonerIcon(icon_id);
    this.current_name = name;
  }

}