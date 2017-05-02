import {Component, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Summoner} from "../../../../models/summoner";
import {PreferencesService} from "../../../../services/preferences.service";
import {PlayerApiService} from "../../../../services/player-api.service";
import {GameType} from "../../../../enums/game-type";
import {ResType} from "../../../../enums/api-response-type";
import {Subscription} from "rxjs/Subscription";
import {TranslatorService} from "../../../../services/translator.service";
import {Observable} from "rxjs/Observable";
import {Champion} from "../../../../models/champion";
import {Mastery} from "../../../../models/mastery";

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnChanges {

  @Input() champions_metadata: Array<Champion>;
  @Input() summoner: Summoner;
  private ongoing_request: Subscription = null;
  private loading = true;

  private gamehistory = null;
  private gamehistory_error_text_key = "";
  private gamehistory_error_details = "";

  private masterypoints: Array<Mastery> = null;
  private masterypoints_error_text_key = "";
  private masterypoints_error_details = "";

  private rankedwinrate = null;
  private rankedwinrate_error_text_key = "";
  private rankedwinrate_error_details = "";

  private Math;
  private gettext: Function;

  constructor(private preferences_service: PreferencesService,
              private player_api: PlayerApiService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
    this.Math = Math;
  }

  private _processGamehistoryResponse(api_res) {
    switch (api_res.type) {
      case ResType.SUCCESS:
        this.gamehistory = api_res.data;
        break;

      case ResType.ERROR:
        this.gamehistory_error_text_key = "internal_server_error";
        this.gamehistory_error_details = api_res.error;
        break;

      case ResType.NOT_FOUND:
        this.gamehistory_error_text_key = "gamehistory_not_found";
        break;

      case ResType.TRY_LATER:
        this.gamehistory_error_text_key = "try_again_in_a_minute";
        break;
    }
  }

  private _processMasterypointsResponse(api_res) {
    switch (api_res.type) {
      case ResType.SUCCESS:
        this.masterypoints = api_res.data.map(m_json => new Mastery(m_json, this.champions_metadata))
          .sort((a,b) => b.total_points - a.total_points);
        break;

      case ResType.ERROR:
        this.masterypoints_error_text_key = "internal_server_error";
        this.masterypoints_error_details = api_res.error;
        break;

      case ResType.NOT_FOUND:
        this.masterypoints_error_text_key = "gamehistory_not_found";
        break;

      case ResType.TRY_LATER:
        this.masterypoints_error_text_key = "try_again_in_a_minute";
        break;
    }
  }

  private _processRankedstatsResponse(api_res) {
    switch (api_res.type) {
      case ResType.SUCCESS:
        this.rankedwinrate = api_res.data;
        break;

      case ResType.ERROR:
        this.rankedwinrate_error_text_key = "internal_server_error";
        this.rankedwinrate_error_details = api_res.error;
        break;

      case ResType.NOT_FOUND:
        this.rankedwinrate_error_text_key = "gamehistory_not_found";
        break;

      case ResType.TRY_LATER:
        this.rankedwinrate_error_text_key = "try_again_in_a_minute";
        break;
    }
  }

  ngOnChanges(changes) {
    // If [summoner] changed
    if (changes['summoner'].currentValue != changes['summoner'].previousValue) {
      this.gamehistory = null;
      this.gamehistory_error_text_key = "";
      this.gamehistory_error_details = "";
      this.masterypoints = null;
      this.masterypoints_error_text_key = "";
      this.masterypoints_error_details = "";
      this.rankedwinrate = null;
      this.rankedwinrate_error_text_key = "";
      this.rankedwinrate_error_details = "";
      this.loading = true;

      if (this.ongoing_request) {
        this.ongoing_request.unsubscribe();
      }

      let region = this.preferences_service.preferences['region'];
      let summoner_id = this.summoner.id;
      this.ongoing_request = Observable.forkJoin([
        this.player_api.getListOfRecentGames(region, summoner_id, GameType.SOLO_AND_FLEXQUEUE),
        this.player_api.getMasteryPointCounts(region, summoner_id),
        this.player_api.getRankedWinrate(region, summoner_id)
      ])
        .subscribe(api_responses => {
          this._processGamehistoryResponse(api_responses[0]);
          this._processMasterypointsResponse(api_responses[1]);
          this._processRankedstatsResponse(api_responses[2]);

          this.loading = false;
        });
    }
  }

  ngOnInit() {
  }

}
