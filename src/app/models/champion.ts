export class Champion {

  // Make all properties read-only, using encapsulation
  private _id;
  private _name;
  public get id() { return this._id; }
  public get name() { return this._name; }

  constructor(id, name) {
    this._id = id;
    this._name = name;
  }
}