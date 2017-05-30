import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() moveup = new EventEmitter();
  @Output() movedown = new EventEmitter();

  private loading_player_data = true;
  private loading_gamehistory = false;

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

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  ngOnInit() {
    this.ratelimitedRequests.buffer(() => {return this.player_api.getSummonerByName(this.region, this.player.summoner_name)})
      .subscribe(summ_api_res => {
        switch (summ_api_res.type) {
          case ResType.SUCCESS:
            this.summoner = summ_api_res.data;
            this.loading_player_data = false;
            this.loading_gamehistory = true;
            this.ratelimitedRequests.buffer(() => {return this.player_api.getListOfRankedGamesJson(this.region, this.summoner.account_id, GameType.SOLO_AND_FLEXQUEUE)})
              .subscribe(gamehistory_api_res => {
                switch (gamehistory_api_res.type) {
                  case ResType.SUCCESS:
                    let gamehistory = gamehistory_api_res.data.map(record => new GameReference(record, this.champions));
                    this.gamehistory = gamehistory;
                    this.preferred_lanes = gamehistory.reduce((seen_lanes, gameref: GameReference) => {
                      let seen_lane = seen_lanes.find(s => s.lane_name === gameref.in_select_lane);
                      if (!seen_lane) {
                        seen_lane = {
                          lane_name: gameref.in_select_lane,
                          nr_of_games: 0
                        };
                        seen_lanes.push(seen_lane);
                      }
                      seen_lane.nr_of_games++;
                      return seen_lanes;
                    }, [])
                      .sort((a,b) => b.nr_of_games - a.nr_of_games)
                      .slice(0,2)
                      .map(preferred_lane => {
                        preferred_lane['percentage'] = Math.round(preferred_lane.nr_of_games / gamehistory.length * 100);
                        return preferred_lane;
                      });
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
