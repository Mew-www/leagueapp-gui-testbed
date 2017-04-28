import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {Champion} from "../models/champion";
import {Observable} from "rxjs";
import {ApiResponse, ApiResponseError, ApiResponseSuccess} from "../helpers/api-response";

@Injectable()
export class StaticApiService {

  private _champions: Array<Champion> = null;
  private _champions_request: Observable<ApiResponse<Array<Champion>, String, any>> = null;
  private _item_table: Object = null;
  private _item_request: Observable<ApiResponse<Object, String, any>> = null;

  constructor(private http: Http) { }

  private _cacheAndWrapChampionApiResponse(res: Response): ApiResponse<Array<Champion>, String, any> {
    switch(res.status) {
      case 200:
        let array_of_champions = res.json().map(dataset => new Champion(dataset['id'], dataset['name']));
        // Cache
        this._champions = array_of_champions;
        // ..and return
        return new ApiResponseSuccess(array_of_champions);

      default:
        return new ApiResponseError(`Error when requesting URI "${ApiRoutes.CHAMPION_LIST_URI}"`);
    }
  }
  private _cacheAndWrapItemsApiResponse(res: Response): ApiResponse<Object, String, any> {
    switch(res.status) {
      case 200:
        let items_json = res.json();
        let item_table = items_json['data'];
        // Cache
        this._item_table = item_table;
        // ..and return
        return new ApiResponseSuccess(item_table);

      default:
        return new ApiResponseError(`Error when requesting URI "${ApiRoutes.ITEM_LIST_URI}"`);
    }
  }

  public getChampions(): Observable<ApiResponse<Array<Champion>, String, any>> {
    // #1 retrieve data from cache
    if (this._champions) {
      return Observable.of(new ApiResponseSuccess(this._champions));
    }
    // #2 retrieve an ongoing request for data
    if (this._champions_request) {
      return this._champions_request;
    }
    // #3 create a request and return it
    this._champions_request = this.http.get(ApiRoutes.CHAMPION_LIST_URI)
      .map(res => this._cacheAndWrapChampionApiResponse(res))
      .share();
    return this._champions_request;
  }
  public getItemMap(): Observable<ApiResponse<Object, String, any>> {
    // #1 retrieve data from cache
    if (this._item_table) {
      return Observable.of(new ApiResponseSuccess<Object>(this._item_table));
    }
    // #2 retrieve an ongoing request for data
    if (this._item_request) {
      return this._item_request;
    }
    // #3 create a request and return it
    this._item_request = this.http.get(ApiRoutes.ITEM_LIST_URI)
      .map(res => this._cacheAndWrapItemsApiResponse(res))
      .share();
    return this._item_request;
  }
  public reloadChampions() {
    this._champions = null;
    this._champions_request = this.http.get(ApiRoutes.CHAMPION_LIST_URI)
      .map(res => this._cacheAndWrapChampionApiResponse(res))
      .share();
  }
  public reloadItemMap() {
    this._item_table = null;
    this._item_request = this.http.get(ApiRoutes.ITEM_LIST_URI)
      .map(res => this._cacheAndWrapItemsApiResponse(res))
      .share();
  }
  public updateChampionDatabase(): Observable<boolean> {
    return this.http.get(ApiRoutes.CHAMPION_REFRESH_URI)
      .map(res => {
        return res.status == 200;
      });
  }
  public updateItemDatabase(): Observable<boolean> {
    return this.http.get(ApiRoutes.ITEM_REFRESH_URI)
      .map(res => {
        return res.status == 200;
      });
  }

}