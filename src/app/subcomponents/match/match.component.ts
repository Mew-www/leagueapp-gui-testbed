import { Component, OnInit } from '@angular/core';
import {Summoner} from "../../models/dto/summoner";
import {Observable} from "rxjs/Observable";
import {SummonerspellsContainer} from "../../models/dto/containers/summonerspells-container";
import {ItemsContainer} from "../../models/dto/containers/items-container";
import {ChampionsContainer} from "../../models/dto/containers/champions-container";
import {ResType} from "../../enums/api-response-type";
import {StaticApiService} from "../../services/static-api.service";

@Component({
  selector: 'match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  // Metadata - loaded in this class during initialization
  private champions: ChampionsContainer;
  private items: ItemsContainer;
  private summonerspells: SummonerspellsContainer;
  private is_metadata_ready: boolean = false;

  private game_possibly_started: boolean = false;
  private ally_teammate: Summoner = null;
  private error_message = "";

  constructor(private static_api: StaticApiService) {
  }

  private handleGameStartedWithTeammate(ally_summoner: Summoner) {
    this.game_possibly_started = true;
    this.ally_teammate = ally_summoner;
  }

  private handleGameNotFound(invalid_ally: Summoner) {
    if (invalid_ally === null) {
      this.error_message = "An error happened trying to request current match. Try again.";
    } else {
      this.error_message = `Teammate ${invalid_ally.current_name} is not in game yet. Try again later.`;
    }
    this.game_possibly_started = false;
  }

  ngOnInit() {
    Observable.forkJoin([
      this.static_api.getChampions(),
      this.static_api.getItems(),
      this.static_api.getSummonerspells()
    ])
      .subscribe(static_api_responses => {
        if (Object.keys(static_api_responses).every(k => static_api_responses[k].type == ResType.SUCCESS)) {
          this.champions = static_api_responses[0].data;
          this.items = static_api_responses[1].data;
          this.summonerspells = static_api_responses[2].data;
          this.is_metadata_ready = true;
        }
      });
  }
}