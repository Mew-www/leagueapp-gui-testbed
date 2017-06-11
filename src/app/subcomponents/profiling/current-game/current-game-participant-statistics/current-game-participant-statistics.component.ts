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
import {ItemsContainer} from "../../../../models/dto/containers/items-container";
import {PlayedChampionDetails} from "../../../../models/played-champion-details";

@Component({
  selector: 'current-game-participant-statistics',
  templateUrl: './current-game-participant-statistics.component.html',
  styleUrls: ['./current-game-participant-statistics.component.scss']
})
export class CurrentGameParticipantStatisticsComponent implements OnInit, OnChanges {

  @Input() spectatorcache_id;
  @Input() player: CurrentGameParticipant;
  @Input() region;
  @Input() gametype: GameType;
  @Input() show_also_secondary_queue_stats: boolean = false;

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  // Signaling parent component this player's gamehistory is loading/loaded
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
  private current_lane = null;
  private preferred_lanes: Array<any> = null;
  private played_champion_details: PlayedChampionDetails = null;
  private error_text_key = "";
  private error_details = "";

  private gettext: Function;
  private GameType = GameType;
  private Math = Math;

  private top_lane_queue_img_uri = Settings.STATIC_BASE_URI + "top_lane_queue.png";
  private jungle_lane_queue_img_uri = Settings.STATIC_BASE_URI + "jungle_lane_queue.png";
  private mid_lane_queue_img_uri = Settings.STATIC_BASE_URI + "mid_lane_queue.png";
  private bottom_lane_queue_img_uri = Settings.STATIC_BASE_URI + "bottom_lane_queue.png";

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private mapToLaneName(lane) {
    return lane.lane_name;
  }

  private handleCurrentLaneChanged(lane_name) {
    console.log(lane_name);
    if (!lane_name) {
      return;
    }

    if (lane_name === "BOTTOM1" || lane_name === "BOTTOM2") {
      this.current_lane = "BOTTOM";
    } else {
      this.current_lane = lane_name;
    }
  }

  private getTimeAgoAsString(date: Date) {
    if (date === null) {
      return this.gettext('never');
    }

    let time_difference_ms = new Date().getTime() - date.getTime(); // now - then
    let local_yesterday_begin = ((new Date()).getHours() + 24) * 1000 * 60 * 60; // (Hours today + 24 hours) earlier

    if (time_difference_ms < 1000*60*60*24) {
      // Less-than-day ago
      let full_hours_ago = Math.floor(time_difference_ms / (1000*60*60));
      if (full_hours_ago == 0) {
        // Count minutes instead
        let full_minutes_ago = Math.floor(time_difference_ms / (1000*60));
        if (full_minutes_ago == 0) {
          return `${this.gettext("just_now")}`;
        }
        if (full_minutes_ago == 1) {
          return `1 ${this.gettext("minute_ago")}`;
        }
        // Else
        return `${full_minutes_ago} ${this.gettext("n_minutes_ago")}`;
      }
      if (full_hours_ago == 1) {
        return `1  ${this.gettext("hour_ago")}`;
      }
      // Else
      return `${full_hours_ago} ${this.gettext("n_hours_ago")}`;

    } else if (time_difference_ms < local_yesterday_begin) {
      // Since (local-/browsertime) "yesterday" began
      return this.gettext("yesterday");

    } else {
      // DD. MM. YYYY
      return ("0"+date.getDate()).slice(-2) + '.' + ("0"+(date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    }
  }

  private togglePlayedChampionDetails(played_champion) {
    // If already open -> toggle per champion
    if (this.played_champion_details && this.played_champion_details.champion.id === played_champion.champion.id) {
      this.played_champion_details = null;
    } else {
      this.played_champion_details = new PlayedChampionDetails(played_champion.champion, played_champion.gamereferences);
    }
  }

  ngOnInit() { }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('show_also_secondary_queue_stats') &&
        changes['show_also_secondary_queue_stats'].currentValue !== changes['show_also_secondary_queue_stats'].previousValue) {

      // If data is already cached, just return it
      if (this.gametype === GameType.SOLO_QUEUE && this.show_also_secondary_queue_stats === false && this._cached_gamehistories.soloqueue !== null) {
        this.gamehistory = this._cached_gamehistories.soloqueue;
        this.preferred_lanes = Analytics.parsePreferredLanes(this.gamehistory);
        return;
      }
      if (this.gametype === GameType.FLEX_QUEUE && this.show_also_secondary_queue_stats === false && this._cached_gamehistories.flexqueue !== null) {
        this.gamehistory = this._cached_gamehistories.flexqueue;
        this.preferred_lanes = Analytics.parsePreferredLanes(this.gamehistory);
        return;
      }
      if (this.show_also_secondary_queue_stats === true && this._cached_gamehistories.combined !== null) {
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
          return this.player_api.getSummonerByNameSpectatorcached(this.region, this.player.summoner_name, this.spectatorcache_id)
        });
      }

      // Subscribe to existing or just-created playerdata request
      this.ongoing_playerdata_request = this.observable_playerdata_request.subscribe(summ_api_res => {
        switch (summ_api_res.type) {
          case ResType.SUCCESS:
            this.summoner = summ_api_res.data;
            this.loading_player_data = false;
            this.loading_gamehistory = true;
            let queues_to_look_up = this.show_also_secondary_queue_stats ? GameType.SOLO_AND_FLEXQUEUE : this.gametype;
            this.ongoing_gamehistory_request = this.ratelimitedRequests.buffer(() => {
              return this.player_api.getListOfRankedGamesJsonSpectatorcached(this.region, this.summoner.account_id, queues_to_look_up, this.spectatorcache_id);
            })
              .subscribe(gamehistory_api_res => {
                switch (gamehistory_api_res.type) {
                  case ResType.SUCCESS:
                    let gamehistory = gamehistory_api_res.data.map(record => new GameReference(record, this.champions));
                    if (this.show_also_secondary_queue_stats) {
                      this._cached_gamehistories.combined = gamehistory;
                    } else {
                      switch (this.gametype) {
                        case GameType.SOLO_QUEUE:
                          this._cached_gamehistories.soloqueue = gamehistory;
                          break;
                        case GameType.FLEX_QUEUE:
                          this._cached_gamehistories.flexqueue = gamehistory;
                          break;
                      }
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
