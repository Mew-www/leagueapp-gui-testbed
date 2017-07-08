import {Component, Input, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'finished-items-history',
  templateUrl: './finished-items-history.component.html',
  styleUrls: ['./finished-items-history.component.scss']
})
export class FinishedItemsHistoryComponent implements OnInit {

  @Input() total_number_of_games: number;
  @Input() mostly_finished_items: Array<any>;
  @Input() nth_finished_items: Array<any>;

  private minimized: boolean = true;
  private scrolling_timeout = null;

  private gettext: Function;

  constructor(private translatorService: TranslatorService) {
    this.gettext = this.translatorService.getTranslation;
  }

  private reverseSortByPercentage(a,b) {
    return b.percentage - a.percentage;
  }

  private scrollToBottom(last_container) {
    if (this.scrolling_timeout) {
      window.clearTimeout(this.scrolling_timeout);
    }
    this.scrolling_timeout = setTimeout(() => {
      let bottom_position = last_container.offsetTop + last_container.offsetHeight;
      let window_position = window.document.documentElement.scrollTop + window.innerHeight;
      if (window_position < bottom_position) {
        window.scroll(0, bottom_position - window.innerHeight);
      }
    }, 100);
  }

  ngOnInit() {
  }

}
