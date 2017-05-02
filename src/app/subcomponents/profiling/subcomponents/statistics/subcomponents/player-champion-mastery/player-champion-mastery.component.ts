import {Component, Input, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../../../services/translator.service";
import {Mastery} from "../../../../../../models/mastery";

@Component({
  selector: 'player-champion-mastery',
  templateUrl: './player-champion-mastery.component.html',
  styleUrls: ['./player-champion-mastery.component.scss']
})
export class PlayerChampionMasteryComponent implements OnInit {

  @Input() mastery: Mastery;
  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = translator.getTranslation;
  }

  private getTimeAgoAsString(date: Date) {
    let time_difference_ms = (new Date()).getTime() - date.getTime(); // braces are just to clarify
    let local_yesterday_begin = ((new Date()).getHours() + 24) * 1000 * 60 * 60; // (Hours today + 24 hours) earlier

    if (time_difference_ms < 1000*60*60*24) {
      // Less-than-day ago
      let full_hours_ago = Math.floor(time_difference_ms / (1000*60*60));
      return `${full_hours_ago} ${this.gettext("n_hours_ago")}`;

    } else if (time_difference_ms < local_yesterday_begin) {
      // Since (local-/browsertime) "yesterday" began
      return this.gettext("yesterday");

    } else {
      // DD. MM. YYYY
      return ("0"+date.getDate()).slice(-2) + '. ' + ("0"+(date.getMonth()+1)).slice(-2) + '. ' + date.getFullYear();
    }
  }

  ngOnInit() {
  }

}
