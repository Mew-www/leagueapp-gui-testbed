import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../models/dto/summoner";
import {ChampionsContainer} from "../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../models/dto/containers/items-container";
import {GameReference} from "../../../../models/dto/game-reference";
import {GameType} from "../../../../enums/game-type";

@Component({
  selector: 'summoner-gamehistory',
  templateUrl: './summoner-gamehistory.component.html',
  styleUrls: ['./summoner-gamehistory.component.scss']
})
export class SummonerGamehistoryComponent implements OnInit {

  @Input() summoner: Summoner;
  @Input() gamehistory: Array<GameReference>;
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;

  private gamehistory_filter_queues: Array<GameType> = [];
  private gamehistory_filter_champion_ids: Array<number> = [];

  private autoload_these_games = [];

  constructor() { }

  private getFilteredGames() {
    return this.gamehistory
      .filter(g => {
        if (this.gamehistory_filter_queues.length === 0) {
          return true;
        }
        return this.gamehistory_filter_queues.indexOf(g.game_type) !== -1;
      })
      .filter(g => {
        if (this.gamehistory_filter_champion_ids.length === 0) {
          return true;
        }
        return this.gamehistory_filter_champion_ids.indexOf(g.chosen_champion.id) !== -1;
      });
  }
  private getFilteredLoadedGames() {
    return this.gamehistory
      .filter(g => {
        if (this.gamehistory_filter_queues.length === 0) {
          return true;
        }
        return this.gamehistory_filter_queues.indexOf(g.game_type) !== -1;
      })
      .filter(g => {
        if (this.gamehistory_filter_champion_ids.length === 0) {
          return true;
        }
        return this.gamehistory_filter_champion_ids.indexOf(g.chosen_champion.id) !== -1;
      })
      .filter(g => g.game_details !== null)
      .map(g => g.game_details);
  }

  ngOnInit() {
    this.autoload_these_games = this.gamehistory.slice(0,30).map(g => g.game_id);
  }

}
