import { Component, OnInit } from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";
import {GameType} from "../../../enums/game-type";
import {Observable} from "rxjs/Observable";
import {StaticApiService} from "../../../services/static-api.service";
import {ResType} from "../../../enums/api-response-type";
import {ChampionsContainer} from "../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "app/models/dto/containers/summonerspells-container";

@Component({
  selector: 'pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {

  // Metadata - loaded in this class during initialization
  private champions: ChampionsContainer;
  private items: ItemsContainer;
  private summonerspells: SummonerspellsContainer;
  private is_metadata_ready: boolean = false;

  private queue_type: GameType = null;
  private teammates: Array<Summoner> = null;

  constructor(private static_api: StaticApiService) {
  }

  private handleChosenQueueType(queue_type) {
    this.queue_type = queue_type;
  }

  private handleNewTeammates(teammates) {
    this.teammates = teammates;
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
