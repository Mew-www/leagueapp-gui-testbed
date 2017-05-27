import {Item} from "../item";

export class ItemsContainer {

  private _items_by_id = {};

  constructor(items_api_json) {
    Object.keys(items_api_json).forEach(key => {
      let item_json = items_api_json[key];
      this._items_by_id[item_json['id']] = new Item(item_json);
    });
  }

  public getItemById(id) {
    if (id in this._items_by_id) {
      return this._items_by_id[id];
    }
    return new Item({
      'id': -1,
      'name': "UnknownItem"+id,
      'plaintext': "",
      'description': "",
      'stats': {},
      'ddragon_key': "404.png",
      'gold': {base: 0, total: 0, sell: 0}
    });
  }
}