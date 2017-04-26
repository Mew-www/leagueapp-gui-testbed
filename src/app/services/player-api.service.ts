import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Summoner} from "../models/summoner";
import {ApiRoutes} from "../constants/api-routes";
import {
  ApiResponse, ApiResponseError, ApiResponseNotFound, ApiResponseSuccess,
  ApiResponseTryLater
} from "../helpers/api-response";
import {GameType} from "../enums/game-type";

@Injectable()
export class PlayerApiService {

  constructor(private http: Http) { }

  private static wrapSummonerApiResponse(res: Response): ApiResponse {
    switch (res.status) {
      case 404:
        return new ApiResponseNotFound(); // Non-existing summoner name or ID

      case 200:
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(summoner_json['id'], summoner_json['name']));

      case 500:
        if (res.json().hasOwnProperty("status") && res.json()['status'] === 503) {
          return new ApiResponseTryLater(res.json()['data']['Retry-After']);
        } else {
          return new ApiResponseError(res.json()['data']);
        }

      default:
        return new ApiResponseError(res.text());
    }
  }

  private static wrapRecentgamesApiResponse(res: Response): ApiResponse {
    switch (res.status) {
      case 404:
        return new ApiResponseNotFound(); // Invalid summoner ID

      case 200:
        let historical_data = res.json();
        let total_existing_records = historical_data['totalGames'];
        let records = historical_data['matches'].map(match => {
          return {
            match_id: match['matchId'],
            timestamp: match['timestamp'],
            chosen_champion_id: match['champion'],
            game_type: ((type: String) => {
              switch (type) {
                case "RANKED_FLEX_SR":            return GameType.FLEX_QUEUE;
                case "TEAM_BUILDER_RANKED_SOLO":  return GameType.SOLO_QUEUE;
                default:                          return GameType.UNKNOWN_UNDEFINED;
              }
            })(match['queue']),
          }
        }).sort((a,b) => a['timestamp'] - b['timestamp']);
        return new ApiResponseSuccess({total_existing_records: total_existing_records, records: records});

      case 500:
        if (res.json().hasOwnProperty("status") && res.json()['status'] === 503) {
          return new ApiResponseTryLater(res.json()['data']['Retry-After']);
        } else {
          return new ApiResponseError(res.json()['data']);
        }

      default:
        return new ApiResponseError(res.text());
    }
  }

  public getSummonerByName(region, name): Observable<ApiResponse> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_NAME_URI(region, name))
      .map(res => PlayerApiService.wrapSummonerApiResponse(res));
  }

  public getSummonerById(region, summoner_id): Observable<ApiResponse> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_SUMMID_URI(region, summoner_id))
      .map(res => PlayerApiService.wrapSummonerApiResponse(res));
  }

  public getListOfRecentGames(region, summoner_id, game_type, max_nr_of_games): Observable<ApiResponse> {
    return this.http.get(ApiRoutes.PLAYER_RANKED_GAME_HISTORY_URI(game_type, max_nr_of_games, region, summoner_id))
      .map(res => PlayerApiService.wrapRecentgamesApiResponse(res));
  }
}