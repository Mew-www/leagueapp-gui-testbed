import {ItemImages} from "./sub/item-images";

export class Item {

  public readonly id;
  public readonly name;
  public readonly description;
  public readonly ingame_xml;
  public readonly stats;
  public readonly images: ItemImages;
  public readonly from;
  public readonly gold;

  // https://developer.riotgames.com/api-methods/#static-data-v3/GET_getItemList
  constructor(item_json) {
    this.id          = item_json['id'];
    this.name        = item_json['name'];
    this.description = item_json['plaintext'];
    this.ingame_xml  = item_json['description'];
    this.stats       = item_json['stats'];
    this.images      = new ItemImages(item_json['ddragon_key']);
    this.from        = item_json.hasOwnProperty('from') ? item_json['from'] : [];
    this.gold        = {
      base: item_json['gold']['base'],
      total: item_json['gold']['total'],
      sell: item_json['gold']['sell']
    };
  }
}