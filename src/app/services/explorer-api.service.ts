import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {ApiResponseError, ApiResponseSuccess} from "../helpers/api-response";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ExplorerApiService {

  constructor(private http: Http) { }

  public getLoadedPeople() {
    return this.http.get(ApiRoutes.EXPLORER_SEEN_PEOPLE)
      .map(res => {
        return new ApiResponseSuccess(res.json());
      }).catch(error_res => {
          return Observable.of(new ApiResponseError(error_res.text()));
      });
  }
  public saveLoadedPeople(summoner_id_array) {
    return this.http.post(ApiRoutes.EXPLORER_SEEN_PEOPLE, JSON.stringify(summoner_id_array))
      .map(res => {
        return new ApiResponseSuccess(res.text());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }

  public getLoadedMatches() {
    return this.http.get(ApiRoutes.EXPLORER_SEEN_MATCHES)
      .map(res => {
        return new ApiResponseSuccess(res.json());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }
  public saveLoadedMatches(match_id_array) {
    return this.http.post(ApiRoutes.EXPLORER_SEEN_MATCHES, JSON.stringify(match_id_array))
      .map(res => {
        return new ApiResponseSuccess(res.text());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }

  public getLoadedTimelines() {
    return this.http.get(ApiRoutes.EXPLORER_SEEN_TIMELINES)
      .map(res => {
        return new ApiResponseSuccess(res.json());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }
  public saveLoadedTimelines(match_id_array) {
    return this.http.post(ApiRoutes.EXPLORER_SEEN_TIMELINES, JSON.stringify(match_id_array))
      .map(res => {
        return new ApiResponseSuccess(res.text());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }

  public getFailedRequests() {
    return this.http.get(ApiRoutes.EXPLORER_FAILED_REQUESTS)
      .map(res => {
        return new ApiResponseSuccess(res.json());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }
  public saveFailedRequests(request_content_array) {
    return this.http.post(ApiRoutes.EXPLORER_FAILED_REQUESTS, JSON.stringify(request_content_array))
      .map(res => {
        return new ApiResponseSuccess(res.text());
      }).catch(error_res => {
        return Observable.of(new ApiResponseError(error_res.text()));
      });
  }
}