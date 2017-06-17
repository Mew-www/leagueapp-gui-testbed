import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";
import {PlayerApiService} from "../../../services/player-api.service";
import {GameType} from "../../../enums/game-type";
import {ResType} from "../../../enums/api-response-type";
import {Subscription} from "rxjs/Subscription";
import {TranslatorService} from "../../../services/translator.service";
import {Observable} from "rxjs/Observable";
import {Championmastery} from "../../../models/dto/championmastery";
import {GameReference} from "../../../models/dto/game-reference";
import {ChampionsContainer} from "app/models/dto/containers/champions-container";
import {ItemsContainer} from "../../../models/dto/containers/items-container";
import {RatelimitedRequestsService} from "../../../services/ratelimited-requests.service";
import {SummonerspellsContainer} from "../../../models/dto/containers/summonerspells-container";

@Component({
  selector: 'summoner-statistics',
  templateUrl: './summoner-statistics.component.html',
  styleUrls: ['./summoner-statistics.component.scss']
})
export class SummonerStatisticsComponent implements OnInit, OnChanges {

  @Input() summoner: Summoner;
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;
  private ongoing_request: Subscription = null;
  private loading = true;

  private gamehistory: Array<GameReference> = null;
  private gamehistory_toggled = true;
  private gamehistory_error_text_key = "";
  private gamehistory_error_details = "";

  private masterypoints: Array<Championmastery> = null;
  private masterypoints_toggled = true;
  private masterypoints_error_text_key = "";
  private masterypoints_error_details = "";

  private gettext: Function;

  constructor(private player_api: PlayerApiService,
              private translator: TranslatorService,
              private ratelimitedRequests: RatelimitedRequestsService) {
    this.gettext = this.translator.getTranslation;
  }

  private onClickToggleChampionmasteries() {
    this.masterypoints_toggled = !this.masterypoints_toggled;
  }

  private onClickToggleGamehistory() {
    this.gamehistory_toggled = !this.gamehistory_toggled;
  }

  private _processGamehistoryJsonResponse(api_res) {
    switch (api_res.type) {
      case ResType.SUCCESS:
        this.gamehistory = api_res.data.map(record => new GameReference(record, this.champions));
        break;

      case ResType.ERROR:
        this.gamehistory_error_text_key = "internal_server_error";
        this.gamehistory_error_details = api_res.error;
        break;

      case ResType.NOT_FOUND:
        this.gamehistory_error_text_key = "gamehistory_not_found";
        break;
    }
  }
  private _processMasterypointsJsonResponse(api_res) {
    switch (api_res.type) {
      case ResType.SUCCESS:
        this.masterypoints = api_res.data.map(m_json => new Championmastery(m_json, this.champions))
          .sort((a,b) => b.total_points - a.total_points);
        break;

      case ResType.ERROR:
        this.masterypoints_error_text_key = "internal_server_error";
        this.masterypoints_error_details = api_res.error;
        break;

      case ResType.NOT_FOUND:
        this.masterypoints_error_text_key = "gamehistory_not_found";
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
      this.loading = true;

      if (this.ongoing_request) {
        this.ongoing_request.unsubscribe();
      }

      let region = this.summoner.region;
      let account_id = this.summoner.account_id;
      let summoner_id = this.summoner.id;
      this.ongoing_request = Observable.forkJoin([
        this.ratelimitedRequests.buffer(() => {return this.player_api.getListOfRankedGamesJson(region, account_id, GameType.SOLO_AND_FLEXQUEUE_5V5)}),
        this.ratelimitedRequests.buffer(() => {return this.player_api.getMasteryPointCountsJson(region, summoner_id)})
      ])
        .subscribe(api_responses => {
          this._processGamehistoryJsonResponse(api_responses[0]);
          this._processMasterypointsJsonResponse(api_responses[1]);

          this.loading = false;
        });
    }
  }

  ngOnInit() { }

}
