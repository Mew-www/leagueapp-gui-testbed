import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameReference} from "../../../../../../models/dto/game-reference";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {RatelimitedRequestsService} from "../../../../../../services/ratelimited-requests.service";
import {GameApiService} from "../../../../../../services/game-api.service";
import {ResType} from "../../../../../../enums/api-response-type";
import {Summoner} from "../../../../../../models/dto/summoner";
import {GameRecordPersonalised} from "../../../../../../models/game-record-personalised";
import {GameRecord} from "../../../../../../models/dto/game-record";
import {ChampionsContainer} from "../../../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "../../../../../../models/dto/containers/summonerspells-container";
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'previous-games',
  templateUrl: './previous-games.component.html',
  styleUrls: ['./previous-games.component.scss']
})
export class PreviousGamesComponent implements OnInit {

  @Input() summoner: Summoner; // Required
  @Input() slice_of_gamehistory: Array<GameReference>; // Required
  @Input() limit: number = null; // Optional; First N games

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  // State output
  @Output() loaded: EventEmitter<boolean> = new EventEmitter();

  private ongoing_request: Subscription = null;
  private game_summaries = null;
  private error = '';

  // Utils
  private gettext: Function;

  constructor(private buffered_requests: RatelimitedRequestsService,
              private game_api: GameApiService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private getTimeAgoAsString(date: Date) {

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

  ngOnInit() {
    // If limit is set then apply it
    let first_n_gamereferences = this.limit ? this.slice_of_gamehistory.slice(0, this.limit) : this.slice_of_gamehistory;

    // Start loading (optionally limited) game details
    this.ongoing_request = Observable.forkJoin(
      first_n_gamereferences.map((gameref: GameReference) => this.buffered_requests.buffer(() => {
        return this.game_api.getHistoricalGame(gameref.region, gameref.game_id);
      }))
    )
      .subscribe(game_api_responses => {
        if (game_api_responses.every(api_res => api_res.type == ResType.SUCCESS)) {
          let game_details = [];
          for (let i=0; i<first_n_gamereferences.length; i++) {
            game_details.push(new GameRecordPersonalised(
              (<GameRecord> game_api_responses[i].data).raw_origin,
              this.summoner,
              this.champions,
              this.items,
              this.summonerspells
            ));
          }

          this.game_summaries = game_details.map(g => {
            let player_itself = g.teams.ally.players.find(p => p.is_the_target);
            return {
              player_as_participant: player_itself,
              victory: g.teams.ally.stats.isWinningTeam,
              start_time: g.match_start_time,
              nr_carry: g.teams.ally.players
                .sort((p1,p2) => p2.stats.combat_totals.damage_dealt_vs_champions.all - p1.stats.combat_totals.damage_dealt_vs_champions.all)
                .map(p => p.summoner.id)
                .indexOf(this.summoner.id)+1,
              kda: player_itself.stats.kda.kills + '/' + player_itself.stats.kda.deaths + '/' + player_itself.stats.kda.assists,
              cs_lane: player_itself.stats.creeps.lane,
              cs_jungle: player_itself.stats.creeps.jungle
            }
          });
        } else {
          this.error = 'Something went wrong when requesting game details.';
        }
        this.loaded.emit(true);
      });
  }

}
