import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CurrentGameParticipant} from "../../../../models/dto/current-game-participant";
import {GameReference} from "../../../../models/dto/game-reference";
import {GameApiService} from "../../../../services/game-api.service";
import {RatelimitedRequestsService} from "../../../../services/ratelimited-requests.service";
import {PlayerApiService} from "../../../../services/player-api.service";
import {ResType} from "../../../../enums/api-response-type";
import {Summoner} from "../../../../models/dto/summoner";
import {GameType} from "../../../../enums/game-type";
import {ChampionsContainer} from "../../../../models/dto/containers/champions-container";
import {SummonerspellsContainer} from "../../../../models/dto/containers/summonerspells-container";
import {TranslatorService} from "../../../../services/translator.service";
import {Settings} from "../../../../constants/settings";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Analytics} from "../../../../helpers/analytics";

@Component({
  selector: 'current-game-participant-statistics',
  templateUrl: './current-game-participant-statistics.component.html',
  styleUrls: ['./current-game-participant-statistics.component.scss']
})
export class CurrentGameParticipantStatisticsComponent implements OnInit, OnChanges {

  @Input() match_id;
  @Input() player: CurrentGameParticipant;
  @Input() region;
  @Input() gametype: GameType;
  @Input() queues_to_look_up: GameType = null;
  @Input() champions: ChampionsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  @Output() signalGamehistoryLoading = new EventEmitter();
  @Output() signalGamehistoryLoaded = new EventEmitter();

  private loading_player_data = true;
  private loading_gamehistory = false;
  private observable_playerdata_request: Observable<any> = null;
  private ongoing_playerdata_request: Subscription = null;
  private ongoing_gamehistory_request: Subscription = null;
  private _cached_gamehistories = {
    'soloqueue': null,
    'flexqueue': null,
    'combined': null // Could be solo+flex but this keeps the option of adding more queue types (normal, 3v3, etc.)
  };

  private summoner: Summoner;
  private gamehistory: Array<GameReference> = null;
  private preferred_lanes: Array<any> = null;
  private error_text_key = "";
  private error_details = "";

  private top_lane_queue_img_uri = Settings.STATIC_BASE_URI + "top_lane_queue.png";
  private jungle_lane_queue_img_uri = Settings.STATIC_BASE_URI + "jungle_lane_queue.png";
  private mid_lane_queue_img_uri = Settings.STATIC_BASE_URI + "mid_lane_queue.png";
  private bottom_lane_queue_img_uri = Settings.STATIC_BASE_URI + "bottom_lane_queue.png";

  private gettext: Function;
  private GameType = GameType;

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  ngOnInit() { }

  ngOnChanges(changes) {
    if (changes['queues_to_look_up'].currentValue !== changes['queues_to_look_up'].previousValue) {

      // If data is already cached, just return it
      if (this.queues_to_look_up === GameType.SOLO_QUEUE && this._cached_gamehistories.soloqueue !== null) {
        this.gamehistory = this._cached_gamehistories.soloqueue;
        this.preferred_lanes = Analytics.parsePreferredLanes(this.gamehistory);
        return;
      }
      if (this.queues_to_look_up === GameType.FLEX_QUEUE && this._cached_gamehistories.flexqueue !== null) {
        this.gamehistory = this._cached_gamehistories.flexqueue;
        this.preferred_lanes = Analytics.parsePreferredLanes(this.gamehistory);
        return;
      }
      if (this.queues_to_look_up === GameType.SOLO_AND_FLEXQUEUE && this._cached_gamehistories.combined !== null) {
        this.gamehistory = this._cached_gamehistories.combined;
        this.preferred_lanes = Analytics.parsePreferredLanes(this.gamehistory);
        return;
      }

      // Cancel (if any) previous subscriptions
      if (this.ongoing_gamehistory_request !== null) {
        this.ongoing_gamehistory_request.unsubscribe();
      }
      if (this.ongoing_playerdata_request !== null) {
        this.ongoing_playerdata_request.unsubscribe();
      }

      // Signal the start of loading
      this.signalGamehistoryLoading.emit();

      // If first run, else don't re-create
      if (this.observable_playerdata_request === null) {
        this.observable_playerdata_request = this.ratelimitedRequests.buffer(() => {
          return this.player_api.getSummonerByNameSpectatorcached(this.region, this.player.summoner_name, this.match_id)
        });
      }

      // Subscribe to existing or just-created playerdata request
      this.ongoing_playerdata_request = this.observable_playerdata_request.subscribe(summ_api_res => {
        switch (summ_api_res.type) {
          case ResType.SUCCESS:
            this.summoner = summ_api_res.data;
            this.loading_player_data = false;
            this.loading_gamehistory = true;
            this.ongoing_gamehistory_request = this.ratelimitedRequests.buffer(() => {
              return this.player_api.getListOfRankedGamesJsonSpectatorcached(this.region, this.summoner.account_id, this.queues_to_look_up, this.match_id);
            })
              .subscribe(gamehistory_api_res => {
                switch (gamehistory_api_res.type) {
                  case ResType.SUCCESS:
                    let gamehistory = gamehistory_api_res.data.map(record => new GameReference(record, this.champions));
                    switch (this.queues_to_look_up) {
                      case GameType.SOLO_QUEUE:
                        this._cached_gamehistories.soloqueue = gamehistory;
                        break;
                      case GameType.FLEX_QUEUE:
                        this._cached_gamehistories.flexqueue = gamehistory;
                        break;
                      case GameType.SOLO_AND_FLEXQUEUE:
                        this._cached_gamehistories.combined = gamehistory;
                        break;
                    }
                    this.gamehistory = gamehistory;
                    this.preferred_lanes = Analytics.parsePreferredLanes(gamehistory);
                    break;

                  case ResType.ERROR:
                    this.error_text_key = "internal_server_error";
                    this.error_details = gamehistory_api_res.error;
                    break;

                  case ResType.NOT_FOUND:
                    this.gamehistory = [];
                    break;
                }
                this.loading_gamehistory = false;
                // Signal loaded all the gamehistory for this player
                this.signalGamehistoryLoaded.emit();
              });
            break;

          case ResType.ERROR:
            this.error_text_key = "internal_server_error";
            this.error_details = summ_api_res.error;
            this.loading_player_data = false;
            break;
        }
      });
    }
  }

}
