import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ApiRoutes} from "../constants/api-routes";
import {
  ApiResponse, ApiResponseError, ApiResponseNotFound, ApiResponseSuccess,
  ApiResponseTryLater
} from "../helpers/api-response";
import {GameRecord} from "../models/dto/game-record";
import {CurrentGame} from "../models/dto/current-game";
import {GameTimeline} from "../models/dto/game-timeline";

@Injectable()
export class GameApiService {

  private _cached_historic_games = {}; // Region -> Game_id -> GameRecord
  private _historic_game_requests = {}; // Region -> Game_id -> observable_request<GameRecord>

  private _cached_historic_timelines = {}; // Region -> Game_id -> GameTimeline
  private _historic_timeline_requests = {}; // Region -> Game_id -> observable_request<GameTimeline>

  constructor(private http: Http) { }

  private _cacheAndWrapGamedetailApiResponse(res: Response, region, game_id): ApiResponse<GameRecord, string, Number> {
    let game_json = res.json();
    let game_record = new GameRecord(game_json);
    // Cache
    if (!(region in this._cached_historic_games)) {
      this._cached_historic_games[region] = {};
    }
    this._cached_historic_games[region][game_id] = game_record;
    // ..and return
    return new ApiResponseSuccess(game_record);
  }
  private _wrapGamedetailApiError(error_res: Response): Observable<ApiResponse<GameRecord, string, Number>> {
    switch (error_res.status) {
      case 404:
        return Observable.of(new ApiResponseNotFound());

      case 500:
        if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
          return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
        } else {
          return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
        }

      default:
        return Observable.of(new ApiResponseError(error_res.text()));
    }
  }

  private _cacheAndWrapGametimelineApiResponse(res: Response, region, game_id): ApiResponse<GameTimeline, string, Number> {
    let timeline_json = res.json();
    let game_timeline = new GameTimeline(timeline_json);
    // Cache
    if (!(region in this._cached_historic_timelines)) {
      this._cached_historic_timelines[region] = {};
    }
    this._cached_historic_timelines[region][game_id] = game_timeline;
    // ..and return
    return new ApiResponseSuccess(game_timeline);
  }
  private _wrapGametimelineApiError(error_res: Response): Observable<ApiResponse<GameTimeline, string, Number>> {
    switch (error_res.status) {
      case 404:
        return Observable.of(new ApiResponseNotFound());

      case 500:
        if (error_res.json().hasOwnProperty("status") && error_res.json()['status'] === 418) {
          return Observable.of(new ApiResponseTryLater(error_res.json()['data']['Retry-After']));
        } else {
          return Observable.of(new ApiResponseError(error_res.json()['data'].toString()));
        }

      default:
        return Observable.of(new ApiResponseError(error_res.text()));
    }
  }

  public getHistoricalGame(region, game_id): Observable<ApiResponse<GameRecord, string, Number>> {
    // #1 check if cached
    if (region in this._cached_historic_games && game_id in this._cached_historic_games[region]) {
      return Observable.of(new ApiResponseSuccess(this._cached_historic_games[region][game_id]));
    }
    // #2 check if already requested
    if (region in this._historic_game_requests && game_id in this._historic_game_requests[region]) {
      return this._historic_game_requests[region][game_id];
    }
    // #3 request the gamedata
    if (!(region in this._historic_game_requests)) {
      this._historic_game_requests[region] = {};
    }
    this._historic_game_requests[region][game_id] = this.http.get(ApiRoutes.GAME_DETAILS_URI(region, game_id))
      .map(res => this._cacheAndWrapGamedetailApiResponse(res, region, game_id))
      .catch(error_res => this._wrapGamedetailApiError(error_res))
      .share();
    return this._historic_game_requests[region][game_id];
  }
  public getHistoricalTimeline(region, game_id): Observable<ApiResponse<GameTimeline, string, Number>> {
    // #1 check if cached
    if (region in this._cached_historic_timelines && game_id in this._cached_historic_timelines[region]) {
      return Observable.of(new ApiResponseSuccess(this._cached_historic_timelines[region][game_id]));
    }
    // #2 check if already requested
    if (region in this._historic_timeline_requests && game_id in this._historic_timeline_requests[region]) {
      return this._historic_timeline_requests[region][game_id];
    }
    // #3 request the gamedata
    if (!(region in this._historic_timeline_requests)) {
      this._historic_timeline_requests[region] = {};
    }
    this._historic_timeline_requests[region][game_id] = this.http.get(ApiRoutes.GAME_TIMELINE_URI(region, game_id))
      .map(res => this._cacheAndWrapGametimelineApiResponse(res, region, game_id))
      .catch(error_res => this._wrapGametimelineApiError(error_res))
      .share();
    return this._historic_timeline_requests[region][game_id];
  }
  public getCurrentGame(summoner, champions, summonerspells): Observable<ApiResponse<CurrentGame, string, Number>> {
    return this.http.get(ApiRoutes.PLAYER_CURRENT_GAME_URI(summoner.region, summoner.id))
      .map(res => {
        let current_game_json = res.json();
        return new ApiResponseSuccess(new CurrentGame(current_game_json, summoner, champions, summonerspells));
      }).catch(error_res => {
        switch (error_res.status) {

          case 404:
            return Observable.of(new ApiResponseNotFound()); // Not currently in game or invalid region/summoner_id

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
