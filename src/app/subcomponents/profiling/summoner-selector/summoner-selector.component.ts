import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";
import {PlayerApiService} from "../../../services/player-api.service";
import {ResType} from "../../../enums/api-response-type";
import {TranslatorService} from "../../../services/translator.service";
import {PreferencesService} from "../../../services/preferences.service";

@Component({
  selector: 'app-summoner-selector',
  templateUrl: './summoner-selector.component.html',
  styleUrls: ['./summoner-selector.component.scss']
})
export class SummonerSelectorComponent implements OnInit {

  @Output() selectedSummoner = new EventEmitter<Summoner>();
  @Input() region;
  private search_history = [];
  private search_term = "";
  private search_in_progress = false;
  private error_text_key = "";
  private error_details = "";
  private gettext: Function;

  constructor(private player_api: PlayerApiService,
              private translator: TranslatorService,
              private preferencesService: PreferencesService) {
    this.gettext = this.translator.getTranslation;
  }

  private searchSummoner() {
    if (this.search_in_progress) {
      return;
    }

    this.search_in_progress = true;
    this.error_text_key = "";
    this.error_details = "";

    this.player_api.getSummonerByName(this.region, this.search_term)
      .subscribe(api_res => {
        switch (api_res.type) {
          case ResType.NOT_FOUND:
            this.error_text_key = "summoner_not_found";
            // Leave search_term to remind what went wrong
            break;

          case ResType.TRY_LATER:
            this.error_text_key = "try_again_in_a_minute";
            // No point in clearing search_term
            break;

          case ResType.ERROR:
            this.error_text_key = "internal_server_error";
            this.error_details = api_res.error;
            // No point in clearing search_term
            break;

          case ResType.SUCCESS:
            this.selectedSummoner.emit(api_res.data);
            // Save (successful) search history
            let prev_searches_str = this.preferencesService.getPref('search_history');
            let prev_searches     = prev_searches_str !== null ? JSON.parse(prev_searches_str) : [];
            let uniq_summ_id      = api_res.data.current_name + '#' + api_res.data.region + '#' + api_res.data.account_id;
            if (prev_searches.indexOf(uniq_summ_id) === -1) {
              prev_searches.push(uniq_summ_id);
              this.preferencesService.setPref('search_history', JSON.stringify(prev_searches));
            }
            // Set URL fragment
            window.location.hash = api_res.data.region + api_res.data.account_id;
            this.search_term = "";
            break;
        }
        this.search_in_progress = false;
      });
  }

  private searchHistoricalSummoner(region, account_id) {
    if (this.search_in_progress) {
      return;
    }

    this.search_in_progress = true;
    this.error_text_key = "";
    this.error_details = "";

    this.player_api.getSummonerById(region, account_id)
      .subscribe(api_res => {
        switch (api_res.type) {
          case ResType.NOT_FOUND:
            this.error_text_key = "summoner_id_not_found";
            // Leave search_term to remind what went wrong
            break;

          case ResType.TRY_LATER:
            this.error_text_key = "try_again_in_a_minute";
            // No point in clearing search_term
            break;

          case ResType.ERROR:
            this.error_text_key = "internal_server_error";
            this.error_details = api_res.error;
            // No point in clearing search_term
            break;

          case ResType.SUCCESS:
            this.selectedSummoner.emit(api_res.data);
            // Save (successful) search history
            let prev_searches_str = this.preferencesService.getPref('search_history');
            let prev_searches     = prev_searches_str !== null ? JSON.parse(prev_searches_str) : [];
            let uniq_summ_id      = api_res.data.current_name + '#' + api_res.data.region + '#' + api_res.data.account_id;
            // Occurs if search was initiated by URL fragment
            if (prev_searches.indexOf(uniq_summ_id) === -1) {
              prev_searches.push(uniq_summ_id);
              this.preferencesService.setPref('search_history', JSON.stringify(prev_searches));
            }
            this.search_term = "";
            break;
        }
        this.search_in_progress = false;
      });
  }

  private clearHistory() {
    this.preferencesService.setPref('search_history', JSON.stringify([]));
  }

  ngOnInit() {
    this.preferencesService.preferences$
      .subscribe(new_prefs => {
        if (new_prefs.hasOwnProperty('search_history')) {
          this.search_history = JSON.parse(new_prefs['search_history'])
            .map(h => {
              return {
                name: h.split('#')[0],
                region: h.split('#')[1],
                account_id: h.split('#')[2] };
            });
        }
      });
    // Check for URL if there's an existing selection
    if (window.location.hash) {
      let region = window.location.hash.replace(/[^a-z]/gi, '');
      let account_id = window.location.hash.replace(/[^0-9]/g, '');
      this.searchHistoricalSummoner(region, account_id);
    }
  }

}
