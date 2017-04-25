import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {Champion} from "../models/champion";
import {Observable} from "rxjs";
import {ApiResponse} from "../helpers/api-response";
import {ResType} from "../enums/api-response-type";

@Injectable()
export class StaticApiService {

  private _champions: Array<Champion> = null;
  private _champions_request: Observable<ApiResponse> = null;
  private _item_table: Object = null;
  private _item_request: Observable<ApiResponse> = null;

  constructor(private http: Http) { }

  private requestChampions() {
    return this.http.get(ApiRoutes.CHAMPION_LIST_URI)
      .map(res => {
        switch(res.status) {
          case 200:
            let array_of_champions = (<Array<any>>res.json()).map(dataset => new Champion(dataset));
            // Cache
            this._champions = array_of_champions;
            // ..and return
            return new ApiResponse(
              ResType.SUCCESS,
              array_of_champions
            );

          default:
            return new ApiResponse(
              ResType.ERROR,
              `Error when requesting "list_of_champions" from "${ApiRoutes.CHAMPION_LIST_URI}"`
            );
        }
      })
      .share();
  }

  private requestItems() {
    return this.http.get(ApiRoutes.ITEM_LIST_URI)
      .map(res => {
        switch(res.status) {
          case 200:
            let items_json = res.json();
            let item_table = items_json['data'];
            // Cache
            this._item_table = item_table;
            // ..and return
            return new ApiResponse(
              ResType.SUCCESS,
              item_table
            );

          default:
            return new ApiResponse(
              ResType.ERROR,
              `Error when requesting "all items' dataset" from "${ApiRoutes.ITEM_LIST_URI}"`
            )
        }
      })
      .share();
  }

  public getChampions(): Observable<ApiResponse> {
    // #1 retrieve data from cache
    if (this._champions) {
      return Observable.of(new ApiResponse(ResType.SUCCESS, this._champions));
    }
    // #2 retrieve an ongoing request for data
    if (this._champions_request) {
      return this._champions_request;
    }
    // #3 create a request and return it
    this._champions_request = this.requestChampions();
    return this._champions_request;
  }

  public getItemMap(): Observable<ApiResponse> {
    // #1 retrieve data from cache
    if (this._item_table) {
      return Observable.of(new ApiResponse(ResType.SUCCESS, this._item_table));
    }
    // #2 retrieve an ongoing request for data
    if (this._item_request) {
      return this._item_request;
    }
    // #3 create a request and return it
    this._item_request = this.requestItems();
    return this._item_request;
  }

  public reloadChampions() {
    this._champions = null;
    this._champions_request = this.requestChampions();
  }

  public reloadItemMap() {
    this._item_table = null;
    this._item_request = this.requestItems();
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