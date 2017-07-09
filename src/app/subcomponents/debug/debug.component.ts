import { Component, OnInit } from '@angular/core';
import {Log, LogHistoryService} from "../../services/log-history.service";
import {TranslatorService} from "../../services/translator.service";

@Component({
  selector: 'debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  private logs: Array<Log> = [];
  private gettext: Function;

  constructor(private log_history: LogHistoryService, private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private getTimeAgoAsString(date: Date) {

    let time_difference_ms = new Date().getTime() - date.getTime(); // now - then
    let local_yesterday_begin = ((new Date()).getHours() + 24) * 1000 * 60 * 60; // (Hours today + 24 hours) earlier

    if (time_difference_ms < 1000*60*60*24) {
      // Less-than-day ago
      let full_hours_ago = Math.floor(time_difference_ms / (1000*60*60));
      if (full_hours_ago == 0) {
        // Count minutes instead
        let full_minutes_ago = Math.floor(time_difference_ms / (1000*60));
        if (full_minutes_ago == 0) {
          return `${this.gettext("just_now")}`;
        }
        if (full_minutes_ago == 1) {
          return `1 ${this.gettext("minute_ago")}`;
        }
        // Else
        return `${full_minutes_ago} ${this.gettext("n_minutes_ago")}`;
      }
      if (full_hours_ago == 1) {
        return `1  ${this.gettext("hour_ago")}`;
      }
      // Else
      return `${full_hours_ago} ${this.gettext("n_hours_ago")}`;

    } else if (time_difference_ms < local_yesterday_begin) {
      // Since (local-/browsertime) "yesterday" began
      return this.gettext("yesterday");

    } else {
      // DD. MM. YYYY
      return ("0"+date.getDate()).slice(-2) + '.' + ("0"+(date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    }
  }

  ngOnInit() {
    this.log_history.log_history$
      .subscribe(updated_history => {
        this.logs = updated_history;
      });
  }

}
