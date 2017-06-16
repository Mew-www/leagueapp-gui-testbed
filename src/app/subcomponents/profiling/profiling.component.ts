import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../models/dto/summoner";
import {TranslatorService} from "../../services/translator.service";
import {PreferencesService} from "../../services/preferences.service";
import {ChampionsContainer} from "../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../models/dto/containers/items-container";
import {ProfileType} from "../../enums/profile-type";
import {SummonerspellsContainer} from "../../models/dto/containers/summonerspells-container";
import {StaticApiService} from "../../services/static-api.service";
import {Observable} from "rxjs/Observable";
import {ResType} from "../../enums/api-response-type";

@Component({
  selector: 'profiling',
  templateUrl: './profiling.component.html',
  styleUrls: ['./profiling.component.scss']
})
export class ProfilingComponent implements OnInit {

  private champions: ChampionsContainer;
  private items: ItemsContainer;
  private summonerspells: SummonerspellsContainer;
  private is_metadata_ready: boolean = false;

  private selected_summoner: Summoner = null;
  private profileTypeEnum = ProfileType;
  private selected_profile_type: ProfileType = null;
  private gettext: Function;
  private current_region;

  constructor(private static_api: StaticApiService,
              private translator: TranslatorService,
              private preferencesService: PreferencesService) {
    this.gettext = this.translator.getTranslation;
  }

  public handleSummonerChanged(new_selected_summoner) {
    this.selected_summoner = new_selected_summoner;
  }

  public handleProfileTypeChanged(new_type) {
    this.selected_profile_type = new_type;
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
    Observable.forkJoin([
      this.static_api.getChampions(),
      this.static_api.getItems(),
      this.static_api.getSummonerspells()
    ])
      .subscribe(static_api_responses => {
        if (Object.keys(static_api_responses).every(k => static_api_responses[k].type == ResType.SUCCESS)) {
          this.champions = static_api_responses[0].data;
          this.items = static_api_responses[1].data;
          this.summonerspells = static_api_responses[2].data;
          this.is_metadata_ready = true;
        }
      });
  }

}