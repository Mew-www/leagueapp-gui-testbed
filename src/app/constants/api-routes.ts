import {Settings} from "./settings";
import {GameType} from "../enums/game-type";
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

  public static PLAYER_RANKED_GAME_HISTORY_URI = (game_type: GameType, region, summoner_id) => {
    switch (game_type) {
      case GameType.FLEX_QUEUE:
        return Settings.API_BASE_URI + "player/history/flex/preview"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      case GameType.SOLO_QUEUE:
        return Settings.API_BASE_URI + "player/history/solo/preview"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      case GameType.SOLO_AND_FLEXQUEUE:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
      default:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&summoner_id=" + summoner_id;
    }
  };

  public static GAME_DETAILS = (region, game_id) => {
    return Settings.API_BASE_URI + "match/details"
      + "?region=" + region
      + "&match_id=" + game_id;
  };

  public static PROFILE_ICON_URI = (icon_id) => {
    return Settings.API_BASE_URI + "static/assets/profile_icons/"+icon_id+".png";
  };
  public static CHAMPION_SQUARE_URI = (champion_ddragon_name) => {
    return Settings.API_BASE_URI + "static/assets/champion_squares/"+champion_ddragon_name+".png";
  };

}