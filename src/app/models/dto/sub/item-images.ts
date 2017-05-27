import {ApiRoutes} from "../../../constants/api-routes";

export class ItemImages {

  public readonly square_url;

  constructor(ddragon_filename) {
    this.square_url = ApiRoutes.ITEM_SQUARE_URI(ddragon_filename);
  }
}