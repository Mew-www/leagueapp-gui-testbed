import {Component, Input, OnInit} from '@angular/core';
import {GameReference} from "../../../../../models/dto/game-reference";
import {TranslatorService} from "../../../../../services/translator.service";
import {GameRecordPersonalised} from "../../../../../models/game-record-personalised";
import {GameApiService} from "../../../../../services/game-api.service";
import {Summoner} from "../../../../../models/dto/summoner";
import {Subscription} from "rxjs/Subscription";
import {ResType} from "../../../../../enums/api-response-type";
import {GameRecord} from "../../../../../models/dto/game-record";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../../models/dto/containers/items-container";
import {RatelimitedRequestsService} from "../../../../../services/ratelimited-requests.service";
import {SummonerspellsContainer} from "../../../../../models/dto/containers/summonerspells-container";

@Component({
  selector: 'player-game-preview',
  templateUrl: './player-game-preview.component.html',
  styleUrls: ['./player-game-preview.component.scss']
})
export class PlayerGamePreviewComponent implements OnInit {

  @Input() auto_start_loading_details = false;
  @Input() game_preview: GameReference;
  @Input() summoner: Summoner;
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;
  private details_toggled = false;
  private ongoing_request: Subscription = null;
  private load_error = "";
  private gettext: Function;

  constructor(private translator: TranslatorService,
              private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService) {
    this.gettext = this.translator.getTranslation;
  }

  private onClickToggleDetails() {
    this.details_toggled = !this.details_toggled;
  }

  private onClickLoadDetails() {
    if (this.ongoing_request) {
      return;
    }
    this.load_error = "";
    let region = this.summoner.region;
    let game_id = this.game_preview.game_id;
    this.ongoing_request = this.ratelimitedRequests.buffer(() => {return this.game_api.getHistoricalGame(region, game_id)})
      .subscribe(api_res => {
        switch (api_res.type) {
          case ResType.SUCCESS:
            this.game_preview.game_details = new GameRecordPersonalised(
              (<GameRecord> api_res.data).raw_origin,
              this.summoner,
              this.champions,
              this.items,
              this.summonerspells
            );
            break;

          default:
            this.load_error = api_res.error;
            this.ongoing_request = null;
            break;
        }
      });
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
    if (this.auto_start_loading_details) {
      let region = this.summoner.region;
      let game_id = this.game_preview.game_id;
      this.ongoing_request = this.ratelimitedRequests.buffer(() => {return this.game_api.getHistoricalGame(region, game_id)})
        .subscribe(api_res => {
          switch (api_res.type) {
            case ResType.SUCCESS:
              this.game_preview.game_details = new GameRecordPersonalised(
                (<GameRecord> api_res.data).raw_origin,
                this.summoner,
                this.champions,
                this.items,
                this.summonerspells
              );
              break;

            case ResType.TRY_LATER:
              this.load_error = "Try again in " + api_res.wait + " seconds.";
              this.ongoing_request = null;
              break;

            default:
              this.load_error = api_res.error;
              this.ongoing_request = null;
              break;
          }
        });
    }
  }

}
