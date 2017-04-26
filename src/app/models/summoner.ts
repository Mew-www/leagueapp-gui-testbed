export class Summoner {

  // Readonly using encapsulation
  private _id;
  public get id() {
    return this._id;
  }
  public current_name;

  constructor(id, name) {
    this._id = id;
    this.current_name = name;
  }

}