import {Component, Input, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'starting-items-history',
  templateUrl: './starting-items-history.component.html',
  styleUrls: ['./starting-items-history.component.scss']
})
export class StartingItemsHistoryComponent implements OnInit {

  @Input() total_number_of_games: number;
  @Input() starting_items_habit: Array<any>;

  private minimized: boolean = true;
  private scrolling_timeout = null;

  private gettext: Function;

  constructor(private translatorService: TranslatorService) {
    this.gettext = this.translatorService.getTranslation;
  }

  private reverseSortByPercentage(a,b) {
    return b.percentage - a.percentage;
  }

  private sortById(a,b) {
    return a.id - b.id;
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
