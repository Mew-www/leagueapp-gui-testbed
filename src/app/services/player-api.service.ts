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

  public getSummonerByName(region, name): Observable<ApiResponse<Summoner, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_NAME_URI(region, name))
      .map(res => {
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(summoner_json['id'], summoner_json['name'], summoner_json['icon']));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Non-existing summoner name or ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 503) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getSummonerById(region, summoner_id): Observable<ApiResponse<Summoner, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_SUMMID_URI(region, summoner_id))
      .map(res => {
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(summoner_json['id'], summoner_json['name'], summoner_json['icon']));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Non-existing summoner name or ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 503) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getListOfRecentGames(region, summoner_id, gametype): Observable<ApiResponse<Object, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_RANKED_GAME_HISTORY_URI(gametype, region, summoner_id))
      .map(res => {
        let historical_data = res.json();
        let total_existing_records = historical_data['totalGames'];
        let records = historical_data['matches'].map(match => {
          return {
            match_id: match['matchId'],
            timestamp: match['timestamp'],
            chosen_champion_id: match['champion'],
            game_type: ((type: String) => {
              switch (type) {
                case "RANKED_FLEX_SR":
                  return GameType.FLEX_QUEUE;
                case "TEAM_BUILDER_RANKED_SOLO":
                  return GameType.SOLO_QUEUE;
                default:
                  return GameType.UNKNOWN_UNDEFINED;
              }
            })(match['queue']),
          }
        }).sort((a, b) => a['timestamp'] - b['timestamp']);
        return new ApiResponseSuccess({total_existing_records: total_existing_records, records: records});
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Invalid summoner ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 503) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
}