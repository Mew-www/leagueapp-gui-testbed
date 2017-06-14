import {Component, Input, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'firstblood-history',
  templateUrl: './firstblood-history.component.html',
  styleUrls: ['./firstblood-history.component.scss']
})
export class FirstbloodHistoryComponent implements OnInit {

  @Input() total_number_of_games: number;
  @Input() firstblood_records;

  private minimized: boolean = true;

  private gettext: Function;

  constructor(private translatorService: TranslatorService) {
    this.gettext = this.translatorService.getTranslation;
  }

  private sortFirstbloodsByDate(a, b) {
    return b.on_date_time.getTime() - a.on_date_time.getTime();
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

  private getGameTimeAsString(ms: number) {
    let padded_seconds = ('0'+Math.floor(ms/1000)%60).slice(-2);
    let padded_minutes = ('0'+Math.floor(ms/(1000*60))).slice(-2);
    return padded_minutes+':'+padded_seconds;
  }

  ngOnInit() { }

}
