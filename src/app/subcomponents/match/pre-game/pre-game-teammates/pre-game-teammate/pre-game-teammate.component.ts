import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Summoner} from "../../../../../models/dto/summoner";
import {PlayerApiService} from "../../../../../services/player-api.service";
import {RatelimitedRequestsService} from "../../../../../services/ratelimited-requests.service";
import {ResType} from "../../../../../enums/api-response-type";
import {GameType} from "../../../../../enums/game-type";
import {GameReference} from "../../../../../models/dto/game-reference";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {GameApiService} from "../../../../../services/game-api.service";
import {ItemsContainer} from "../../../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "../../../../../models/dto/containers/summonerspells-container";
import {Champion} from "../../../../../models/dto/champion";

@Component({
  selector: 'pre-game-teammate',
  templateUrl: './pre-game-teammate.component.html',
  styleUrls: ['./pre-game-teammate.component.scss']
})
export class PreGameTeammateComponent implements OnInit {

  @Input() summoner: Summoner;
  @Input() queueing_for: GameType;
  @Input() display_summoner_icon: boolean = false;
  @Input() use_minified_components: boolean = false;

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  @Input() hide_statistics: boolean;
  @Output() selectedInitialRole: EventEmitter<boolean> = new EventEmitter();

  private role = null;
  private errors = [];
  private readonly time_limit_days = 21;
  private soloqueue_games_this_season = null;
  private flexqueue_games_this_season = null;
  private soloqueue_games_past_3_weeks = null;
  private flexqueue_games_past_3_weeks = null;
  private current_queue_past_3_weeks = null;
  private loading_ready: boolean = false;

  // Utils
  private GameType = GameType;

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private buffered_requests: RatelimitedRequestsService) {
  }

  private handleSelectedRole(role) {
    let is_initial_update = this.role === null;
    // First update role
    this.role = role;
    // Then send upstream "we have selected initial role" if so
    if (is_initial_update) {
      this.selectedInitialRole.emit(true);
    }
  }

  ngOnInit() {
    // Autoload game history -> (max) 20 last ranked games from one queue
    this.buffered_requests.buffer(() => {
      return this.player_api.getListOfRankedGamesJson(this.summoner.region, this.summoner.account_id, GameType.SOLO_AND_FLEXQUEUE_5V5, this.champions)
    })
      .subscribe(api_res => {
        if (api_res.type === ResType.SUCCESS) {
          let all_games = <Array<GameReference>>api_res.data;
          let soloqueue_games_this_season = all_games.filter(gameref => gameref.game_type === GameType.SOLO_QUEUE);
          let flexqueue_games_this_season = all_games.filter(gameref => gameref.game_type === GameType.FLEX_QUEUE_5V5);
          let soloqueue_games_past_3_weeks = soloqueue_games_this_season
            .filter(gameref => gameref.game_start_time.getTime() > (new Date().getTime()-1000*60*60*24*this.time_limit_days));
          let flexqueue_games_past_3_weeks = flexqueue_games_this_season
            .filter(gameref => gameref.game_start_time.getTime() > (new Date().getTime()-1000*60*60*24*this.time_limit_days))

          if (soloqueue_games_this_season.length > 0) {
            this.soloqueue_games_this_season = soloqueue_games_this_season;
          }
          if (flexqueue_games_this_season.length > 0) {
            this.flexqueue_games_this_season = flexqueue_games_this_season;
          }
          if (soloqueue_games_past_3_weeks.length > 0) {
            this.soloqueue_games_past_3_weeks = soloqueue_games_past_3_weeks;
          }
          if (flexqueue_games_past_3_weeks.length > 0) {
            this.flexqueue_games_past_3_weeks = flexqueue_games_past_3_weeks;
          }

          if (this.queueing_for === GameType.SOLO_QUEUE) {
            this.current_queue_past_3_weeks = soloqueue_games_past_3_weeks;
          } else if (this.queueing_for === GameType.FLEX_QUEUE_5V5) {
            this.current_queue_past_3_weeks = flexqueue_games_past_3_weeks;
          } else {
            // Unsupported queue type
            this.errors.push("Unsupported queue type. (This shouldn't be possible. UI y u let this happen?)");
            this.current_queue_past_3_weeks = [];
          }

        }
      });
  }

}
