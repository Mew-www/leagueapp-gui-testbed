export class SummonerIcon {

  public readonly id;
  public readonly url;

  constructor(id) {
    this.id = id;
    this.url = ""; // TODO server-side caching etc.
  }

}