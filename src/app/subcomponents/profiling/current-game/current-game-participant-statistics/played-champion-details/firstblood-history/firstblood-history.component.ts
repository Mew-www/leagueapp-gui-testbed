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

  ngOnInit() {
    console.log(this.firstblood_records);
  }

}
