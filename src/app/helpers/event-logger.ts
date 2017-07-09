import {Http} from "@angular/http";
import {ApiRoutes} from "../constants/api-routes";

export class EventLogger {

  constructor(private http: Http) { }

  public log(message, status) {
    this.http.post(ApiRoutes.LOGGING_URI, JSON.stringify({'msg': message, 'status': status}))
      .subscribe((res) => {});
  }

}