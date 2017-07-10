import { Injectable } from '@angular/core';
import {ConnectionBackend, Http, Request, Response, RequestOptions, RequestOptionsArgs} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {EventLogger} from "../helpers/event-logger";
import {LogHistoryService} from "./log-history.service";

@Injectable()
export class LoggingHttpService extends Http {

  public logger: EventLogger;

  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private log_history: LogHistoryService) {
    super(_backend, _defaultOptions);
    this.logger = new EventLogger(new Http(_backend, _defaultOptions), log_history);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    let url_string = typeof url === 'string' ? url : url.url;
    let request = options ? super.request(url, options) : super.request(url);
    return request
      .map(res => {
        this.logger.log(url_string, 'HTTP', '200');
        return res;
      })
      .catch(error_res => {
        this.logger.log(url_string, 'HTTP', error_res.json()['status'].toString());
        return Observable.throw(error_res);
      });

  };

}
