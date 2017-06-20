import {Component, Input, OnInit} from '@angular/core';
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

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  private role = null;
  private errors = [];
  private readonly time_limit_days = 21;
  private games_past_3_weeks = null;
  private loading_ready: boolean = false;

  private _target_champion = null;
  private target_games = null;

  get target_champion() {
    return this._target_champion;
  }
  set target_champion(id) {
    this._target_champion = id;
    this.target_games = this.games_past_3_weeks.filter(gameref => gameref.chosen_champion.id === id);
  }

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private buffered_requests: RatelimitedRequestsService) {
  }

  private handleSelectedRole(role) {
    this.role = role;
  }

  private getChampionsNameOrdered(): Array<Champion> {
    return this.champions.listChampions().sort((a,b) => a.name.localeCompare(b.name));
  }

  ngOnInit() {
    // Autoload game history -> (max) 20 last ranked games from one queue
    this.buffered_requests.buffer(() => {
      return this.player_api.getListOfRankedGamesJson(this.summoner.region, this.summoner.account_id, GameType.SOLO_AND_FLEXQUEUE_5V5, this.champions)
    })
      .subscribe(api_res => {
        if (api_res.type === ResType.SUCCESS) {
          let games_within_time_limit = api_res.data
            .filter((gameref: GameReference) => gameref.game_start_time.getTime() > (new Date().getTime()-1000*60*60*24*this.time_limit_days));
          let primary_queue_games = games_within_time_limit
            .filter((gameref: GameReference) => gameref.game_type === this.queueing_for);

          // If 0 games found, switch queue type
          if (primary_queue_games.length === 0) {
            this.errors.push("Did not found any games in this queue, during past 3 weeks. Switching to secondary queue stats.");
            let secondary_queue = this.queueing_for === GameType.SOLO_QUEUE ? GameType.FLEX_QUEUE_5V5 : GameType.SOLO_QUEUE;
            let secondary_queue_games = games_within_time_limit
              .filter((gameref: GameReference) => gameref.game_type === secondary_queue);
            if (secondary_queue_games.length === 0) {
              this.errors.push("Player has not played ranked in 3 weeks (solo/duo, flex5v5). Unable to produce stats.");
              return;
            }
            // Else replace primary with secondary queue for further processing
            primary_queue_games = secondary_queue_games;
          }

          // Less than 5 is still acceptable, just notify
          if (primary_queue_games.length < 5) {
            this.errors.push("Found less than 5 games in this queue, during past 3 weeks. Results may not be accurate.");
          }

          // Save un-limited for further use
          this.games_past_3_weeks = primary_queue_games;
        }
      });
  }

}
