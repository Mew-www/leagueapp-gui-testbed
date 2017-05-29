import {Component, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'current-game-participant-statistics',
  templateUrl: './current-game-participant-statistics.component.html',
  styleUrls: ['./current-game-participant-statistics.component.scss']
})
export class CurrentGameParticipantStatisticsComponent implements OnInit {

  @Input() player: CurrentGameParticipant;
  @Input() region;
  @Input() gametype: GameType;
  @Input() champions: ChampionsContainer;
  @Input() summonerspells: SummonerspellsContainer;
  private loading_player_data = true;
  private loading_gamehistory = false;

  private summoner: Summoner;
  private gamehistory: Array<GameReference> = null;
  private error_text_key = "";
  private error_details = "";

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService) { }

  ngOnInit() {
    this.ratelimitedRequests.buffer(() => {return this.player_api.getSummonerByName(this.region, this.player.summoner_name)})
      .subscribe(summ_api_res => {
        switch (summ_api_res.type) {
          case ResType.SUCCESS:
            this.summoner = summ_api_res.data;
            this.loading_player_data = false;
            this.loading_gamehistory = true;
            this.ratelimitedRequests.buffer(() => {return this.player_api.getListOfRankedGamesJson(this.region, this.summoner.account_id, this.gametype)})
              .subscribe(gamehistory_api_res => {
                switch (gamehistory_api_res.type) {
                  case ResType.SUCCESS:
                    this.gamehistory = gamehistory_api_res.data.map(record => new GameReference(record, this.champions));
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
