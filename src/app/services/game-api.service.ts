import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ApiRoutes} from "../constants/api-routes";
import {
  ApiResponse, ApiResponseError, ApiResponseNotFound, ApiResponseSuccess,
  ApiResponseTryLater
} from "../helpers/api-response";
import {GameRecord} from "../models/game-record";

@Injectable()
export class GameApiService {

  private _cached_historic_games = {}; // Region -> Game_id -> GameRecord
  private _historic_game_requests = {}; // Region -> Game_id -> observable_request<GameRecord>

  constructor(private http: Http) { }

  private _cacheAndWrapGamedetailApiResponse(res: Response, region, game_id): ApiResponse<GameRecord, String, Number> {
    switch (res.status) {
      case 404:
        return new ApiResponseNotFound();

      case 200:
        let game_json = res.json();
        let game_record = new GameRecord(game_json);
        // Cache
        if (!(region in this._cached_historic_games)) {
          this._cached_historic_games[region] = {};
        }
        this._cached_historic_games[region][game_id] = game_record;
        // ..and return
        return new ApiResponseSuccess(game_record);

      case 500:
        if (res.json().hasOwnProperty("status") && res.json()['status'] === 503) {
          return new ApiResponseTryLater(res.json()['data']['Retry-After']);
        } else {
          return new ApiResponseError(res.json()['data'].toString());
        }

      default:
        return new ApiResponseError(res.text());
    }
  }

  public getHistoricalGame(region, game_id): Observable<ApiResponse<GameRecord, String, Number>> {
    // #1 check if cached
    if (region in this._cached_historic_games && game_id in this._cached_historic_games[region]) {
      return Observable.of(this._cached_historic_games[region][game_id]);
    }
    // #2 check if already requested
    if (region in this._historic_game_requests && game_id in this._historic_game_requests[region]) {
      return this._historic_game_requests[region][game_id];
    }
    // #3 request the gamedata
    if (!(region in this._historic_game_requests)) {
      this._historic_game_requests[region] = {};
    }
    this._historic_game_requests[region][game_id] = this.http.get(ApiRoutes.GAME_DETAILS(region, game_id))
      .map(res => this._cacheAndWrapGamedetailApiResponse(res, region, game_id))
      .share();
    return this._historic_game_requests[region][game_id];
  }
}
