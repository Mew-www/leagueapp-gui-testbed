import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../models/summoner";
import {TranslatorService} from "../../services/translator.service";
import {Champion} from "../../models/champion";
import {ApiRoutes} from "../../constants/api-routes";

@Component({
  selector: 'profiling',
  templateUrl: './profiling.component.html',
  styleUrls: ['./profiling.component.scss']
})
export class ProfilingComponent implements OnInit {

  @Input() champions_metadata: Array<Champion>;
  @Input() items_metadata;
  private selected_summoner: Summoner = null;
  private gettext: Function;

  constructor(private translator: TranslatorService) { }

  public handleSummonerChanged(new_selected_summoner) {
    this.selected_summoner = new_selected_summoner;
  }

  ngOnInit() {
    this.gettext = this.translator.getTranslation;
  }

}