export class Champion {

  // Make all properties read-only, using encapsulation
  private _id;
  private _name;
  public get id() { return this._id; }
  public get name() { return this._name; }

  constructor(champion_dataset: Object) {
    this._id = champion_dataset['id'];
    this._name = champion_dataset['name'];
  }
}