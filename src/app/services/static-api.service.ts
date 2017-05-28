import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {Observable} from "rxjs";
import {ApiResponse, ApiResponseError, ApiResponseSuccess} from "../helpers/api-response";
import {ChampionsContainer} from "../models/dto/containers/champions-container";
import {ItemsContainer} from "app/models/dto/containers/items-container";

@Injectable()
export class StaticApiService {

  private _champions: ChampionsContainer = null;
  private _champions_request: Observable<ApiResponse<ChampionsContainer, string, any>> = null;
  private _items: ItemsContainer = null;
  private _items_request: Observable<ApiResponse<ItemsContainer, String, any>> = null;

  constructor(private http: Http) { }

  private _cacheAndWrapChampionApiResponse(res: Response): ApiResponse<ChampionsContainer, string, any> {
    let champion_list = new ChampionsContainer(res.json());
    // Cache
    this._champions = champion_list;
    // ..and return
    return new ApiResponseSuccess(champion_list);
  }
  private _cacheAndWrapItemsApiResponse(res: Response): ApiResponse<ItemsContainer, string, any> {
    let items_json = res.json();
    let items = new ItemsContainer(items_json);
    // Cache
    this._items = items;
    // ..and return
    return new ApiResponseSuccess(items);
  }

  public getChampions(): Observable<ApiResponse<ChampionsContainer, string, any>> {
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
      .catch(error => Observable.of(new ApiResponseError(`Error when requesting URI "${ApiRoutes.CHAMPION_LIST_URI}"`)))
      .share();
    return this._champions_request;
  }
  public getItems(): Observable<ApiResponse<ItemsContainer, string, any>> {
    // #1 retrieve data from cache
    if (this._items) {
      return Observable.of(new ApiResponseSuccess(this._items));
    }
    // #2 retrieve an ongoing request for data
    if (this._items_request) {
      return this._items_request;
    }
    // #3 create a request and return it
    this._items_request = this.http.get(ApiRoutes.ITEM_LIST_URI)
      .map(res => this._cacheAndWrapItemsApiResponse(res))
      .catch(error => Observable.of(new ApiResponseError(`Error when requesting URI "${ApiRoutes.ITEM_LIST_URI}"`)))
      .share();
    return this._items_request;
  }
  public reloadChampions() {
    this._champions = null;
    this._champions_request = this.http.get(ApiRoutes.CHAMPION_LIST_URI)
      .map(res => this._cacheAndWrapChampionApiResponse(res))
      .share();
  }
  public reloadItemMap() {
    this._items = null;
    this._items_request = this.http.get(ApiRoutes.ITEM_LIST_URI)
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