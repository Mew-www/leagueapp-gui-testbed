import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../models/summoner";
import {TranslatorService} from "../../services/translator.service";
import {Champion} from "../../models/champion";
import {PreferencesService} from "../../services/preferences.service";

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
  private current_region;

  constructor(private translator: TranslatorService,
              private preferencesService: PreferencesService) {
    this.gettext = this.translator.getTranslation;
  }

  public handleSummonerChanged(new_selected_summoner) {
    this.selected_summoner = new_selected_summoner;
  }

  ngOnInit() {
    this.current_region = this.preferencesService['region']; // Expected to be set before init (see: Setup -component)
    this.preferencesService.preferences$
      .subscribe(new_prefs => {
        if (new_prefs.hasOwnProperty('region') && new_prefs.region !== this.current_region) {
          this.current_region = new_prefs.region;
          this.selected_summoner = null;
        }
      });
  }

}