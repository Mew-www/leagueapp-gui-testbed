import {Http} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";
import {LogHistoryService} from "../services/log-history.service";

export class EventLogger {

  constructor(private http: Http, private log_history: LogHistoryService) { }

  public log(message, type, status) {
    this.http.post(ApiRoutes.LOGGING_URI, JSON.stringify({'msg': message, 'type': type, 'status': status}))
      .subscribe(res => {
        this.log_history.append_history(message, type, status)
      });
  }

}