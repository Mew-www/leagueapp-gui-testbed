import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Summoner} from "../../../../models/summoner";
import {PlayerApiService} from "../../../../services/player-api.service";
import {PreferencesService} from "../../../../services/preferences.service";
import {ResType} from "../../../../enums/api-response-type";
import {TranslatorService} from "../../../../services/translator.service";

@Component({
  selector: 'app-summoner-selector',
  templateUrl: './summoner-selector.component.html',
  styleUrls: ['./summoner-selector.component.scss']
})
export class SummonerSelectorComponent implements OnInit {

  @Output() selectedSummoner = new EventEmitter<Summoner>();
  private search_in_progress = false;
  private error_text_key = "";
  private error_details = "";
  private gettext: Function;

  constructor(private preferencesService: PreferencesService,
              private player_api: PlayerApiService,
              private translator: TranslatorService) { }

  private searchSummoner(name) {
    if (this.search_in_progress) {
      return;
    }

    this.search_in_progress = true;
    this.error_text_key = "";
    this.error_details = "";

    this.player_api.getSummonerByName(this.preferencesService.preferences['region'], name)
      .subscribe(api_res => {
        switch (api_res.type) {
          case ResType.NOT_FOUND:
            this.error_text_key = "summoner_not_found";
            break;

          case ResType.TRY_LATER:
            this.error_text_key = "try_again_in_a_minute";
            break;

          case ResType.ERROR:
            this.error_text_key = "internal_server_error";
            this.error_details = api_res.error;
            break;

          case ResType.SUCCESS:
            this.selectedSummoner.emit(api_res.data);
            break;
        }
        this.search_in_progress = false;
      });
  }

  ngOnInit() {
    this.gettext = this.translator.getTranslation;
  }

}
