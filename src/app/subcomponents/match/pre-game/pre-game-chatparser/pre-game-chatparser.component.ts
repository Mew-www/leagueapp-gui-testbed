import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ResType} from "../../../../enums/api-response-type";
import {Subscription} from "rxjs/Subscription";
import {PlayerApiService} from "../../../../services/player-api.service";
import {RatelimitedRequestsService} from "../../../../services/ratelimited-requests.service";
import {PreferencesService} from "../../../../services/preferences.service";
import {TranslatorService} from "../../../../services/translator.service";
import {Summoner} from "../../../../models/dto/summoner";
import {GameType} from "../../../../enums/game-type";

@Component({
  selector: 'pre-game-chatparser',
  templateUrl: './pre-game-chatparser.component.html',
  styleUrls: ['./pre-game-chatparser.component.scss']
})
export class PreGameChatparserComponent implements OnInit {

  @Output() parsedSummoners: EventEmitter<Array<Summoner>> = new EventEmitter();
  @Output() selectedQueueType: EventEmitter<GameType> = new EventEmitter();

  private current_region = null;

  private chat_content = "";
  private selected_queue: GameType = null;
  private errors = [];
  private subscription: Subscription = null;

  private gettext: Function;
  private GameType = GameType;

  constructor(private player_api: PlayerApiService,
              private bufferedRequests: RatelimitedRequestsService,
              private preferencesService: PreferencesService,
              private translator: TranslatorService) {
    this.gettext = translator.getTranslation;
  }

  private parseChat() {
    this.errors = [];

    let entries = this.chat_content.split('\n').slice(0,5);
    if (entries.length < 5) {
      this.errors.push("Less than 5 names found, please copy and paste all 5 joins.");
      return;
    }
    let players_names = entries.map(entry => entry.split(' joined')[0]);

    this.subscription = Observable.forkJoin(
      players_names.map(name => this.bufferedRequests.buffer(() => {
        return this.player_api.getSummonerByName(this.current_region, name);
      }))
    )
      .subscribe(api_responses => {
        let responses = Object.keys(api_responses).map(k => api_responses[k]);
        if (responses.every(api_res => api_res.type === ResType.SUCCESS)) {
          this.selectedQueueType.emit(this.selected_queue);
          this.parsedSummoners.emit(responses.map(api_res => <Summoner>api_res.data));
        } else {
          responses.forEach((api_res, i) => {
            if (api_res.type === ResType.NOT_FOUND) {
              this.errors.push(`Player ${players_names[i]} wasn't found on server ${this.current_region}.`);
            } else if (api_res.type === ResType.ERROR) {
              this.errors.push(`An error happened in RIOT API while trying to request player ${players_names[i]}.`);
            }
          });
        }
      });
  }

  ngOnInit() {
    this.current_region = this.preferencesService['region']; // Expected to be set before init (see: Setup -component)
    this.preferencesService.preferences$
      .subscribe(new_prefs => {
        if (new_prefs.hasOwnProperty('region') && new_prefs.region !== this.current_region) {
          if (this.subscription !== null && !this.subscription.closed) {
            this.errors.push("Region was changed. Cancelled loading. Please try again.");
            this.subscription.unsubscribe();
          }
          this.current_region = new_prefs.region;
        }
      });
  }

}
