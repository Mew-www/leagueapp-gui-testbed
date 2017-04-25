import {Settings} from "./settings";
export class ApiRoutes {

  public static CHAMPION_LIST_URI = Settings.API_BASE_URI + "static/champions";
  public static CHAMPION_REFRESH_URI = Settings.API_BASE_URI + "static/champions/refresh";

  public static ITEM_LIST_URI = Settings.API_BASE_URI + "static/items";
  public static ITEM_REFRESH_URI = Settings.API_BASE_URI + "static/items/refresh";

  public static PLAYER_BASIC_DATA_BY_NAME_URI = (region, name) => {
    return Settings.API_BASE_URI + "player/basic_data_by_name"
      + "?region=" + region
      + "&name=" + name;
  };
  public static PLAYER_BASIC_DATA_BY_SUMMID_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/basic_data_by_id"
      + "?region=" + region
      + "&summoner_id=" + summoner_id;
  };

  public static PLAYER_MASTERIES_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/masteries"
      + "?region=" + region
      + "&summoner_id=" + summoner_id;
  };
  public static PLAYER_RANKEDSTATS_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/rankedsummary"
      + "?region=" + region
      + "&summoner_id=" + summoner_id;
  };

  public static PLAYER_CURRENT_GAME_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/current_game"
    + "?region=" + region
    + "&summoner_id=" + summoner_id;
  };

  public static PLAYER_RANKED_GAME_HISTORY_URI = (flex_or_solo_or_both, count, region, summoner_id) => {
    switch (flex_or_solo_or_both.toLowerCase()) {
      case "flex":
        return Settings.API_BASE_URI + "player/history/flex/" + count + "/"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      case "solo":
        return Settings.API_BASE_URI + "player/history/solo/" + count + "/"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      case "both":
        return Settings.API_BASE_URI + "player/history/solo_and_flex/" + count + "/"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      default:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/" + count + "/"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
    }
  };

  public static GAME_DETAILS = (region, game_id) => {
    return Settings.API_BASE_URI + "match/details"
      + "?region=" + region
      + "&match_id=" + game_id;
  };

}