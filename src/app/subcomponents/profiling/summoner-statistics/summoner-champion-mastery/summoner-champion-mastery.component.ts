import {Component, Input, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../services/translator.service";
import {Championmastery} from "../../../../models/dto/championmastery";
import {Settings} from "../../../../constants/settings";

@Component({
  selector: 'summoner-champion-mastery',
  templateUrl: './summoner-champion-mastery.component.html',
  styleUrls: ['./summoner-champion-mastery.component.scss']
})
export class SummonerChampionMasteryComponent implements OnInit {

  @Input() mastery: Championmastery;
  private gettext: Function;
  private Math;
  private Array;
  private masteryemote_img_uri = Settings.STATIC_BASE_URI + "masteryemote.svg";
  private chestacquired_img_uri = Settings.STATIC_BASE_URI + "chestacquired.svg";
  private masterytoken_6_have_img_uri = Settings.STATIC_BASE_URI + "masterytoken_6_obtained.svg";
  private masterytoken_6_need_img_uri = Settings.STATIC_BASE_URI + "masterytoken_6_required.svg";
  private masterytoken_7_have_img_uri = Settings.STATIC_BASE_URI + "masterytoken_7_obtained.svg";
  private masterytoken_7_need_img_uri = Settings.STATIC_BASE_URI + "masterytoken_7_required.svg";

  constructor(private translator: TranslatorService) {
    this.gettext = translator.getTranslation;
    this.Math = Math;
    this.Array = Array;
  }

  private getTimeAgoAsString(date: Date) {
    let time_difference_ms = (new Date()).getTime() - date.getTime(); // braces are just to clarify
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
  }

}
