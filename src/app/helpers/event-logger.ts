import {Http} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {LogHistoryService} from "../services/log-history.service";

export class EventLogger {

  constructor(private http: Http, private log_history: LogHistoryService) { }

  public log(message, status) {
    this.http.post(ApiRoutes.LOGGING_URI, JSON.stringify({'msg': message, 'status': status}))
      .subscribe(res => {
        this.log_history.append_history(message, status)
      });
  }

}