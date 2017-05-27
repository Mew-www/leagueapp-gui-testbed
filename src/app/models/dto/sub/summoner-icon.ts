import {ApiRoutes} from "../../../constants/api-routes";

export class SummonerIcon {

  public readonly id;
  public readonly url;

  constructor(id) {
    this.id = id;
    this.url = ApiRoutes.PROFILE_ICON_URI(id);
  }

}