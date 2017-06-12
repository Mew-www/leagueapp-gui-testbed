import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TranslatorService} from "../../../../../services/translator.service";
import {PlayedChampionDetails} from "../../../../../models/played-champion-details";
import {GameTimelinePersonalised} from "../../../../../models/game-timeline-personalised";
import {GameRecordPersonalised} from "../../../../../models/game-record-personalised";
import {GameReference} from "../../../../../models/dto/game-reference";
import {RatelimitedRequestsService} from "../../../../../services/ratelimited-requests.service";
import {Observable} from "rxjs/Observable";
import {GameApiService} from "../../../../../services/game-api.service";
import {Subscription} from "rxjs/Subscription";
import {ResType} from "../../../../../enums/api-response-type";
import {GameRecord} from "../../../../../models/dto/game-record";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "../../../../../models/dto/containers/summonerspells-container";
import {Summoner} from "../../../../../models/dto/summoner";
import {GameTimeline} from "../../../../../models/dto/game-timeline";
import {Analytics} from "../../../../../helpers/analytics";

@Component({
  selector: 'played-champion-details',
  templateUrl: './played-champion-details.component.html',
  styleUrls: ['./played-champion-details.component.scss']
})
export class PlayedChampionDetailsComponent implements OnInit, OnChanges {

  @Input() region;
  @Input() summoner: Summoner;
  @Input() played_champion_details: PlayedChampionDetails = null;

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  public filtertype = 'month_ago';
  private filter_datestring = '';
  private filter_nr_of_games = 0;

  private ongoing_request: Subscription = null;

  private loaded_records: Array<GameRecordPersonalised> = [];
  private initial_loaded_records_length = null;
  private loaded_items_habit = null;
  private loaded_win_statistics = null;
  private loaded_kda_statistics = null;

  private limiter_timeout_id = null;

  private gettext: Function;

  constructor(private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService,
              private translatorService: TranslatorService) {
    this.gettext = this.translatorService.getTranslation;
  }

  private changeViewRange(nr_of_games_limit) {
    if (this.limiter_timeout_id) {
      window.clearTimeout(this.limiter_timeout_id);
    }
    this.limiter_timeout_id = window.setTimeout(
      () => {this.loadRecordsThenTimelines(nr_of_games_limit);},
      500
    );
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

  private getSelectedGames() {
    let all_gamereferences = this.played_champion_details.gamereferences;
    switch (this.filtertype) {
      case 'month_ago':
        return all_gamereferences.filter(this.monthAgoFilter);

      case 'datestring':
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(this.filter_datestring)) {
          return [];
        }
        let date_parts = this.filter_datestring.split("/");
        let date_upto = new Date();
        date_upto.setFullYear(Number(date_parts[2]), Number(date_parts[1])-1, Number(date_parts[0]));
        date_upto.setHours(0, 0, 1);
        if (date_upto < this.played_champion_details.oldest_time_played) {
          date_upto = this.played_champion_details.oldest_time_played;
        }
        return all_gamereferences.filter(gameref => gameref.game_start_time >= date_upto);

      case 'nr_of_games':
        return all_gamereferences.slice(0, this.filter_nr_of_games);

      default:
        throw Error('Missing/invalid filter type currently active');
    }
  }

  private monthAgoFilter(gameref: GameReference) {
    return gameref.game_start_time.getTime() > (new Date().getTime()-1000*60*60*24*31);
  }

  private loadRecordsThenTimelines(opt_nr_of_games_limit?) {
    let gamereferences = this.getSelectedGames();

    if (opt_nr_of_games_limit) {
      gamereferences = gamereferences.slice(0, opt_nr_of_games_limit);
    }

    if (this.ongoing_request && !this.ongoing_request.closed) {
      return;
    }

    if (gamereferences.length === 0) {
      return;
    }

    if (!opt_nr_of_games_limit) {
      // 60+ requests
      if (gamereferences.length > 30 && gamereferences.length <= 100) {
        let sure = window.confirm(this.gettext('are_you_sure_this_gonna_take_a_while'));
        if (!sure) {
          return;
        }
      }

      // 200+ requests
      if (gamereferences.length > 100 && gamereferences.length <= 300) {
        let sure = window.confirm(this.gettext('are_you_damn_sure_about_this'));
        if (!sure) {
          return;
        }
      }

      // 600+ requests
      if (gamereferences.length > 300) {
        let sure = window.confirm(this.gettext('over_300_seriously'));
        if (!sure) {
          return;
        }
      }
    }

    // Reset to their initial state
    this.loaded_records = [];
    this.loaded_items_habit = null;

    this.ongoing_request = Observable.forkJoin(
      gamereferences.map(gameref => {
        return this.ratelimitedRequests.buffer(() => {
          return this.game_api.getHistoricalGame(this.region, gameref.game_id);
        });
      })
    )
      .subscribe(record_responses => {
        if (Object.keys(record_responses).every(k => record_responses[k].type == ResType.SUCCESS)) {
          for (let i=0; i<gamereferences.length; i++) {
            this.loaded_records.push(new GameRecordPersonalised(
              (<GameRecord> record_responses[i].data).raw_origin,
              this.summoner,
              this.champions,
              this.items,
              this.summonerspells
            ));
          }
          // Next fetch timelines of each loaded game-record
          this.ongoing_request = Observable.forkJoin(
            this.loaded_records.map(r => {
              return this.ratelimitedRequests.buffer(() => {
                return this.game_api.getHistoricalTimeline(this.region, r.game_id);
              });
            })
          )
            .subscribe(timeline_responses => {
              if (Object.keys(timeline_responses).every(k => timeline_responses[k].type == ResType.SUCCESS)) {
                for (let i = 0; i < this.loaded_records.length; i++) {
                  let game_record = this.loaded_records[i];
                  let players_by_participant_id_by_teams = game_record.raw_origin.participantIdentities.reduce((mapping, p) => {
                    let ally = game_record.teams.ally.players.find(ally => (<Summoner>ally.summoner).id === p.player.summonerId);
                    let enemy = game_record.teams.enemy.players.find(enemy => (<Summoner>enemy.summoner).id === p.player.summonerId);
                    if (ally) {
                      mapping['allies'][p.participantId] = ally;
                    }
                    if (enemy) {
                      mapping['enemies'][p.participantId] = enemy;
                    }
                    return mapping;
                  }, {allies: {}, enemies: {}});
                  game_record.timeline = new GameTimelinePersonalised(
                    (<GameTimeline> timeline_responses[i].data).raw_origin,
                    players_by_participant_id_by_teams,
                    this.items
                  );
                }
                this.loaded_items_habit = Analytics.parseStartingAndFinishedItemsHabit(
                  this.loaded_records.map(game_record => {
                    return (<GameTimelinePersonalised>game_record.timeline).allies.find(ally => ally.player.is_the_target).item_events;
                  }),
                  []
                );
                this.loaded_win_statistics = [];
                this.loaded_kda_statistics = [];
                if (!opt_nr_of_games_limit) {
                  this.initial_loaded_records_length = this.loaded_records.length;
                }
              }
            });
        }
      });
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    // If target played-champion-details changes, reset any ongoing_request, and reset loaded records and timelines
    if (changes['played_champion_details'].currentValue !== changes['played_champion_details'].previousValue)
    {
      if (this.ongoing_request && !this.ongoing_request.closed) {
        this.ongoing_request.unsubscribe();
      }
      this.loaded_records = [];
      this.loaded_items_habit = null;
      this.loaded_win_statistics = null;
      this.loaded_kda_statistics = null;
      this.ongoing_request = null;
    }
  }
}
