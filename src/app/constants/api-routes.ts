import {Settings} from "./settings";
import {GameType} from "../enums/game-type";
export class ApiRoutes {

  public static CHAMPION_LIST_URI = Settings.API_BASE_URI + "static/champions";
  public static CHAMPION_REFRESH_URI = Settings.API_BASE_URI + "static/champions/refresh";

  public static ITEM_LIST_URI = Settings.API_BASE_URI + "static/items";
  public static ITEM_REFRESH_URI = Settings.API_BASE_URI + "static/items/refresh";

  public static SUMMONERSPELL_LIST_URI = Settings.API_BASE_URI + "static/summonerspells";
  public static SUMMONERSPELL_REFRESH_URI = Settings.API_BASE_URI + "static/summonerspells/refresh";

  public static PLAYER_BASIC_DATA_BY_NAME_URI = (region, name) => {
    return Settings.API_BASE_URI + "player/basic_data_by_name"
      + "?region=" + region
      + "&name=" + name;
  };
  public static PLAYER_BASIC_DATA_BY_NAME_SPECTATORCACHED_URI = (region, name, in_match_id) => {
    return Settings.API_BASE_URI + "player/basic_data_by_name"
      + "?region=" + region
      + "&name=" + name
      + "&inmatch=" + in_match_id;
  };
  public static PLAYER_BASIC_DATA_BY_ACCOUNTID_URI = (region, account_id) => {
    return Settings.API_BASE_URI + "player/basic_data_by_id"
      + "?region=" + region
      + "&account_id=" + account_id;
  };

  public static PLAYER_CHAMPIONMASTERIES_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/championmasteries"
      + "?region=" + region
      + "&summoner_id=" + summoner_id;
  };

  public static PLAYER_CURRENT_GAME_URI = (region, summoner_id) => {
    return Settings.API_BASE_URI + "player/current_game"
    + "?region=" + region
    + "&summoner_id=" + summoner_id;
  };

  public static PLAYER_RANKED_GAME_HISTORY_URI = (game_type: GameType, region, account_id) => {
    switch (game_type) {
      case GameType.FLEX_QUEUE:
        return Settings.API_BASE_URI + "player/history/flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id;
      case GameType.SOLO_QUEUE:
        return Settings.API_BASE_URI + "player/history/solo/preview"
          + "?region=" + region
          + "&account_id=" + account_id;
      case GameType.SOLO_AND_FLEXQUEUE:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id;
      default:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id;
    }
  };
  public static PLAYER_RANKED_GAME_HISTORY_SPECTATORCACHED_URI = (game_type: GameType, region, account_id, in_match_id) => {
    switch (game_type) {
      case GameType.FLEX_QUEUE:
        return Settings.API_BASE_URI + "player/history/flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id
          + "&inmatch=" + in_match_id;
      case GameType.SOLO_QUEUE:
        return Settings.API_BASE_URI + "player/history/solo/preview"
          + "?region=" + region
          + "&account_id=" + account_id
          + "&inmatch=" + in_match_id;
      case GameType.SOLO_AND_FLEXQUEUE:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id
          + "&inmatch=" + in_match_id;
      default:
        return Settings.API_BASE_URI + "player/history/solo_and_flex/preview"
          + "?region=" + region
          + "&account_id=" + account_id
          + "&inmatch=" + in_match_id;
    }
  };

  public static GAME_DETAILS_URI = (region, game_id) => {
    return Settings.API_BASE_URI + "match/details"
      + "?region=" + region
      + "&match_id=" + game_id;
  };

  public static GAME_TIMELINE_URI = (region, game_id) => {
    return Settings.API_BASE_URI + "match/timeline"
      + "?region=" + region
      + "&match_id=" + game_id;
  };

  /* Images */
  public static PROFILE_ICON_URI = (icon_id) => {
    return Settings.API_BASE_URI + "static/assets/profile_icons/"+icon_id+".png";
  };
  public static CHAMPION_SQUARE_URI = (champion_ddragon_name) => {
    if (champion_ddragon_name === "404") {
      return "404.png"
    }
    return Settings.API_BASE_URI + "static/assets/champion_squares/"+champion_ddragon_name+".png";
  };
  public static ITEM_SQUARE_URI = (item_ddragon_filename) => {
    if (item_ddragon_filename === "404") {
      return "404.png"
    }
    return Settings.API_BASE_URI + "static/assets/item_icons/"+item_ddragon_filename;
  };
  public static SUMMONER_SPELL_URI = (summonerspell_ddragon_name) => {
    if (summonerspell_ddragon_name === "404") {
      return "404.png"
    }
    return Settings.API_BASE_URI + "static/assets/summonerspell_icons/"+summonerspell_ddragon_name+".png";
  };

  /* Explorer (dev) API */
  public static EXPLORER_SEEN_PEOPLE = Settings.API_BASE_URI + "explorer/seen_people";
  public static EXPLORER_SEEN_MATCHES =  Settings.API_BASE_URI + "explorer/seen_matches";
  public static EXPLORER_SEEN_TIMELINES =  Settings.API_BASE_URI + "explorer/seen_timelines";
  public static EXPLORER_FAILED_REQUESTS =  Settings.API_BASE_URI + "explorer/failed_requests";
}