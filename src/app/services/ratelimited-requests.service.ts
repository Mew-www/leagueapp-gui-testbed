import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ApiResponse} from "../helpers/api-response";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {ResType} from "../enums/api-response-type";

@Injectable()
export class RatelimitedRequestsService {

  private window_size = 1;
  private readonly window_size_multiplier = 2;
  private readonly max_window_size = 10;
  private buffered_requests = [];
  private ongoing = false;

  constructor() { }

  public buffer(request_function: Function): Observable<ApiResponse<any, string, number>> {
    let result_subject = new AsyncSubject<ApiResponse<any, string, number>>();
    this.buffered_requests.push({
      request_fn: request_function,
      result_subject: result_subject,
      done: false // Use this to differentiate ratelimit-blocked requests from finished ones
    });
    if (!this.ongoing) {
      this.executeRemainingRequests();
    }
    return result_subject.asObservable();
  }

  private executeRemainingRequests() {
    console.log("executing next bunch (if any), window size="+this.window_size);
    if (this.buffered_requests.length === 0) {
      this.ongoing = false;
      return;
    }

    this.ongoing = true;
    let requests_to_do = this.buffered_requests.slice(0, this.window_size);
    Observable.forkJoin(requests_to_do.map(r => r.request_fn()))
      .subscribe(responses => {

        let rate_limit_wait = null; // Not 0, because API might return 0 and we need to differentiate if limited or not
        responses.forEach((res: ApiResponse<any, string, number>, idx) => {
          if (res.type !== ResType.TRY_LATER) {
            this.buffered_requests[idx].done = true;
            this.buffered_requests[idx].result_subject.next(res);
            this.buffered_requests[idx].result_subject.complete();
          } else {
            // We're being rate limited, find highest limit found
            if (rate_limit_wait === null || rate_limit_wait < res.wait) {
              rate_limit_wait = res.wait;
            }
          }
        });

        this.buffered_requests = this.buffered_requests.filter(r => r.done === false);
        if (rate_limit_wait === null) {
          // Increase window size and recursively do next requests
          let proposed_size = Math.round(this.window_size * this.window_size_multiplier);
          this.window_size = (proposed_size < this.max_window_size ? proposed_size : this.max_window_size);
          console.log("Not rate limited, try with window size "+this.window_size);
          this.executeRemainingRequests();
        } else {
          // Decrease window size and wait before recursively doing next requests
          this.window_size = Math.round(this.window_size / this.window_size_multiplier);
          console.log("Got rate limited, try with smaller window size "+this.window_size+" after "+(rate_limit_wait)+" seconds");
          window.setTimeout(this.executeRemainingRequests.bind(this), rate_limit_wait*1000);
        }
      });
  }
}