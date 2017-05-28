import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameApiService} from "../../../services/game-api.service";
import {ChampionsContainer} from "../../../models/dto/containers/champions-container";
import {Summoner} from "../../../models/dto/summoner";
import {Subscription} from "rxjs/Subscription";
import {TranslatorService} from "../../../services/translator.service";
import {RatelimitedRequestsService} from "../../../services/ratelimited-requests.service";
import {CurrentGame} from "../../../models/dto/current-game";
import {ResType} from "../../../enums/api-response-type";

@Component({
  selector: 'current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnChanges {

  @Input() champions: ChampionsContainer;
  @Input() summoner: Summoner;
  private ongoing_request: Subscription = null;
  private loading = true;

  private current_game: CurrentGame = null;
  private current_game_error_text_key = "";
  private current_game_error_details = "";

  private gettext: Function;

  constructor(private game_api: GameApiService,
              private translator: TranslatorService,
              private ratelimitedRequests: RatelimitedRequestsService) {
    this.gettext = this.translator.getTranslation;
  }

  ngOnChanges(changes) {
    // If [summoner] changed
    if (changes['summoner'].currentValue != changes['summoner'].previousValue) {
      this.current_game = null;
      this.current_game_error_text_key = "";
      this.current_game_error_details = "";
      this.loading = true;

      if (this.ongoing_request) {
        this.ongoing_request.unsubscribe();
      }

      let region = this.summoner.region;
      let summoner_id = this.summoner.id;
      this.ongoing_request = this.ratelimitedRequests.buffer(() => {return this.game_api.getCurrentGame(region, summoner_id, this.champions)})
        .subscribe(api_res => {
            switch (api_res.type) {
              case ResType.SUCCESS:
                this.current_game = api_res.data;
                break;

              case ResType.ERROR:
                this.current_game_error_text_key = "internal_server_error";
                this.current_game_error_details = api_res.error;
                break;

              case ResType.NOT_FOUND:
                this.current_game_error_text_key = "current_game_not_found";
                break;
            }

          this.loading = false;
        });
    }
  }

  ngOnInit() { }

}
