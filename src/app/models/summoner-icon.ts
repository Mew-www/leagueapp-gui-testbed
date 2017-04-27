export class SummonerIcon {

  // readonly using encapsulate
  private _id;
  private _url;
  public get id() { return this._id; }
  public get url() { return this._url; }

  constructor(id) {
    this._id = id;
    this._url = ""; // TODO server-side caching etc.
  }

}