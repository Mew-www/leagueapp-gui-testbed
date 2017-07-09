import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Summoner} from "../models/dto/summoner";
import {ApiRoutes} from "../constants/api-routes";
import {
  ApiResponse, ApiResponseError, ApiResponseNotFound, ApiResponseSuccess,
  ApiResponseTryLater
} from "../helpers/api-response";
import {LeaguePosition} from "../models/dto/league-position";
import {GameReference} from "../models/dto/game-reference";

@Injectable()
export class PlayerApiService {

  constructor(private http: Http) { }

  public getSummonerByName(region, name): Observable<ApiResponse<Summoner, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_NAME_URI(region, name))
      .map(res => {
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(region, summoner_json['id'], summoner_json['account'], summoner_json['name'], summoner_json['icon']));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Non-existing summoner name or ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getSummonerByNameSpectatorcached(region, name, in_match_id): Observable<ApiResponse<Summoner, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_NAME_SPECTATORCACHED_URI(region, name, in_match_id))
      .map(res => {
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(region, summoner_json['id'], summoner_json['account'], summoner_json['name'], summoner_json['icon']));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Non-existing summoner name or ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getSummonerById(region, account_id): Observable<ApiResponse<Summoner, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_BASIC_DATA_BY_ACCOUNTID_URI(region, account_id))
      .map(res => {
        let summoner_json = res.json();
        return new ApiResponseSuccess(new Summoner(region, summoner_json['id'], summoner_json['account'], summoner_json['name'], summoner_json['icon']));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Non-existing summoner name or ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getListOfRankedGamesJson(region, account_id, gametype, champions): Observable<ApiResponse<Array<GameReference>, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_RANKED_GAME_HISTORY_URI(gametype, region, account_id))
      .map(res => {
        let historical_data = res.json();
        let total_existing_records = historical_data['totalGames'];
        if (total_existing_records === 0) {
          return new ApiResponseNotFound();
        }
        let sorted_gamerefs = historical_data['matches'].map(match_ref_json => new GameReference(match_ref_json, champions))
          .sort((a, b) => b['timestamp'] - a['timestamp']);
        return new ApiResponseSuccess(sorted_gamerefs);
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Invalid summoner ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getListOfRankedGamesJsonSpectatorcached(region, account_id, gametype, in_match_id, champions): Observable<ApiResponse<Array<GameReference>, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_RANKED_GAME_HISTORY_SPECTATORCACHED_URI(gametype, region, account_id, in_match_id))
      .map(res => {
        let historical_data = res.json();
        let total_existing_records = historical_data['totalGames'];
        if (total_existing_records === 0) {
          return new ApiResponseNotFound();
        }
        let sorted_gamerefs = historical_data['matches'].map(match_ref_json => new GameReference(match_ref_json, champions))
          .sort((a, b) => b['timestamp'] - a['timestamp']);
        return new ApiResponseSuccess(sorted_gamerefs);
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Invalid summoner ID

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getMasteryPointCountsJson(region, summoner_id): Observable<ApiResponse<Object, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_CHAMPIONMASTERIES_URI(region, summoner_id))
      .map(res => {
        let masteries_json = res.json();
        return new ApiResponseSuccess(masteries_json);
      }).catch(error_res => {
        switch (error_res.status) {

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
              return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
            } else {
              return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
            }

          default:
            return Observable.of(new ApiResponseError(error_res.text()));
        }
      });
  }
  public getRankings(region, summoner_id): Observable<ApiResponse<Array<LeaguePosition>, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_RANKINGS_URI(region, summoner_id))
      .map(res => {
        let league_positions_json = res.json();
        let league_positions = league_positions_json.map(position_json => new LeaguePosition(position_json));
        return new ApiResponseSuccess(league_positions);
      }).catch(error_res => {
        switch (error_res.status) {

          case 500:
            if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
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