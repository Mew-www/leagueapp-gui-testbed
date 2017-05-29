import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameApiService} from "../../../services/game-api.service";
import {ChampionsContainer} from "../../../models/dto/containers/champions-container";
import {Summoner} from "../../../models/dto/summoner";
import {Subscription} from "rxjs/Subscription";
import {RatelimitedRequestsService} from "../../../services/ratelimited-requests.service";
import {CurrentGame} from "../../../models/dto/current-game";
import {ResType} from "../../../enums/api-response-type";
import {SummonerspellsContainer} from "../../../models/dto/containers/summonerspells-container";

@Component({
  selector: 'current-game',
  templateUrl: './current-game.component.html',
  styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnChanges {

  @Input() champions: ChampionsContainer;
  @Input() summonerspells: SummonerspellsContainer;
  @Input() summoner: Summoner;
  private ongoing_request: Subscription = null;
  private loading = true;

  private current_game: CurrentGame = null;
  private current_game_error_text_key = "";
  private current_game_error_details = "";

  constructor(private game_api: GameApiService,
              private ratelimitedRequests: RatelimitedRequestsService) {
  }

  handleMoveupAlly(p) {
    let idx = 0;
    this.current_game.allies.forEach((ally, i) => {
      if (ally.summoner_id === p.summoner_id) {
        idx = i;
      }
    });
    if (idx === 0) {
      return;
    }
    this.current_game.allies.splice((idx-1), 0, this.current_game.allies.splice(idx,1)[0]);
  }

  handleMovedownAlly(p) {
    let idx = 4;
    this.current_game.allies.forEach((ally, i) => {
      if (ally.summoner_id === p.summoner_id) {
        idx = i;
      }
    });
    if (idx === 4) {
      return;
    }
    this.current_game.allies.splice((idx+1), 0, this.current_game.allies.splice(idx,1)[0]);
  }

  handleMoveupEnemy(p) {
    let idx = 0;
    this.current_game.enemies.forEach((enemy, i) => {
      if (enemy.summoner_id === p.summoner_id) {
        idx = i;
      }
    });
    if (idx === 0) {
      return;
    }
    this.current_game.enemies.splice((idx-1), 0, this.current_game.enemies.splice(idx,1)[0]);
  }

  handleMovedownEnemy(p) {
    let idx = 4;
    this.current_game.enemies.forEach((enemy, i) => {
      if (enemy.summoner_id === p.summoner_id) {
        idx = i;
      }
    });
    if (idx === 4) {
      return;
    }
    this.current_game.enemies.splice((idx+1), 0, this.current_game.enemies.splice(idx,1)[0]);
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

      this.ongoing_request = this.ratelimitedRequests.buffer(() => {
        return this.game_api.getCurrentGame(this.summoner, this.champions, this.summonerspells)
      })
        .subscribe(api_res => {
            switch (api_res.type) {
              case ResType.SUCCESS:
                this.current_game = api_res.data;
                this.current_game.allies.sort((p1, p2) => {
                  // Top
                  if (p1.summonerspell_1.name === "Teleport" || p1.summonerspell_2.name === "Teleport") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Teleport" || p2.summonerspell_2.name === "Teleport") {
                    return 1;
                  }
                  // Jungle
                  if (p1.summonerspell_1.name === "Smite" || p1.summonerspell_2.name === "Smite") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Smite" || p2.summonerspell_2.name === "Smite") {
                    return 1;
                  }
                  // Mid
                  if (p1.summonerspell_1.name === "Ghost" || p1.summonerspell_2.name === "Ghost"
                    || p1.summonerspell_1.name === "Cleanse" || p1.summonerspell_2.name === "Cleanse"
                    || p1.summonerspell_1.name === "Barrier" || p1.summonerspell_2.name === "Barrier"
                    || p1.summonerspell_1.name === "Ignite" || p1.summonerspell_2.name === "Ignite") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Ghost" || p2.summonerspell_2.name === "Ghost"
                    || p2.summonerspell_1.name === "Cleanse" || p2.summonerspell_2.name === "Cleanse"
                    || p2.summonerspell_1.name === "Barrier" || p2.summonerspell_2.name === "Barrier"
                    || p2.summonerspell_1.name === "Ignite" || p2.summonerspell_2.name === "Ignite") {
                    return 1;
                  }
                  // ADC
                  if (p1.summonerspell_1.name === "Heal" || p1.summonerspell_2.name === "Heal") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Heal" || p2.summonerspell_2.name === "Heal") {
                    return 1;
                  }
                  // Support
                  if (p1.summonerspell_1.name === "Exhaust" || p1.summonerspell_2.name === "Exhaust") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Exhaust" || p2.summonerspell_2.name === "Exhaust") {
                    return 1;
                  }
                  return 0;
                });
                this.current_game.enemies.sort((p1, p2) => {
                  // Top
                  if (p1.summonerspell_1.name === "Teleport" || p1.summonerspell_2.name === "Teleport") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Teleport" || p2.summonerspell_2.name === "Teleport") {
                    return 1;
                  }
                  // Jungle
                  if (p1.summonerspell_1.name === "Smite" || p1.summonerspell_2.name === "Smite") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Smite" || p2.summonerspell_2.name === "Smite") {
                    return 1;
                  }
                  // Mid
                  if (p1.summonerspell_1.name === "Sprint" || p1.summonerspell_2.name === "Sprint"
                    || p1.summonerspell_1.name === "Cleanse" || p1.summonerspell_2.name === "Cleanse"
                    || p1.summonerspell_1.name === "Barrier" || p1.summonerspell_2.name === "Barrier"
                    || p1.summonerspell_1.name === "Ignite" || p1.summonerspell_2.name === "Ignite") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Sprint" || p2.summonerspell_2.name === "Sprint"
                    || p2.summonerspell_1.name === "Cleanse" || p2.summonerspell_2.name === "Cleanse"
                    || p2.summonerspell_1.name === "Barrier" || p2.summonerspell_2.name === "Barrier"
                    || p2.summonerspell_1.name === "Ignite" || p2.summonerspell_2.name === "Ignite") {
                    return 1;
                  }
                  // ADC
                  if (p1.summonerspell_1.name === "Heal" || p1.summonerspell_2.name === "Heal") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Heal" || p2.summonerspell_2.name === "Heal") {
                    return 1;
                  }
                  // Support
                  if (p1.summonerspell_1.name === "Exhaust" || p1.summonerspell_2.name === "Exhaust") {
                    return -1;
                  } else if (p2.summonerspell_1.name === "Exhaust" || p2.summonerspell_2.name === "Exhaust") {
                    return 1;
                  }
                  return 0;
                });
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
