import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class Log {
  public readonly message: string;
  public readonly status: string;
  public readonly datetime: Date;
  constructor(message, status) {
    this.message = message;
    this.status = status;
    this.datetime = new Date();
  }
}

@Injectable()
export class LogHistoryService {

  private log_history_source: BehaviorSubject<Array<Log>> = new BehaviorSubject([]);
  public log_history$ = this.log_history_source.asObservable();

  constructor() { }

  public append_history(message, status) {
    this.log_history_source.next(this.log_history_source.value.concat(new Log(message, status)))
  }

}
