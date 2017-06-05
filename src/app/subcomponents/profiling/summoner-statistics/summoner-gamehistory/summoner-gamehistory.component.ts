import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../models/dto/summoner";
import {ChampionsContainer} from "../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../models/dto/containers/items-container";
import {GameReference} from "../../../../models/dto/game-reference";
import {GameType} from "../../../../enums/game-type";
import {TranslatorService} from "../../../../services/translator.service";
import {SummonerspellsContainer} from "../../../../models/dto/containers/summonerspells-container";

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
  @Input() summonerspells: SummonerspellsContainer;

  private available_queue_filters = [
    {'val': GameType.SOLO_QUEUE, 'text_key': "solo_queue"},
    {'val': GameType.FLEX_QUEUE, 'text_key': "flex_queue"}
  ];
  private available_champion_filters: Function;

  private filtered_queues: Array<GameType> = [];
  private filtered_champion_ids: Array<number> = [];

  private autoload_these_games = [];

  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private toggleFilteredChampion(id) {
    let idx = this.filtered_champion_ids.indexOf(id);
    if (idx === -1) {
      this.filtered_champion_ids.push(id);
    } else {
      this.filtered_champion_ids.splice(idx, 1);
    }
  }
  private toggleFilteredQueue(queue) {
    let idx = this.filtered_queues.indexOf(queue);
    if (idx === -1) {
      this.filtered_queues.push(queue);
    } else {
      this.filtered_queues.splice(idx, 1);
    }
  }

  private getFilteredGames() {
    return this.gamehistory
      .filter(g => {
        if (this.filtered_queues.length === 0) {
          return true;
        }
        return this.filtered_queues.indexOf(g.game_type) !== -1;
      })
      .filter(g => {
        if (this.filtered_champion_ids.length === 0) {
          return true;
        }
        return this.filtered_champion_ids.indexOf(g.chosen_champion.id) !== -1;
      });
  }
  private getFilteredLoadedGames() {
    return this.gamehistory
      .filter(g => {
        if (this.filtered_queues.length === 0) {
          return true;
        }
        return this.filtered_queues.indexOf(g.game_type) !== -1;
      })
      .filter(g => {
        if (this.filtered_champion_ids.length === 0) {
          return true;
        }
        return this.filtered_champion_ids.indexOf(g.chosen_champion.id) !== -1;
      })
      .filter(g => g.game_details !== null)
      .map(g => g.game_details);
  }

  ngOnInit() {
    this.available_champion_filters = (queues_filtered) => {
      return this.gamehistory.reduce((seen_champions, game_reference) => {
        // If filtering is on and queue wasn't found in filter -> skip
        if (queues_filtered.length > 0 && queues_filtered.indexOf(game_reference.game_type) === -1) {
          return seen_champions;
        }

        let seen_champion = seen_champions.find(s => s.champion.id === game_reference.chosen_champion.id);
        if (!seen_champion) {
          seen_champions.push({
            champion: this.champions.getChampionById(game_reference.chosen_champion.id),
            nr_of_games: 1
          });
        } else {
          seen_champion.nr_of_games++;
        }
        return seen_champions;
      }, [])
        .sort((a, b) => b.nr_of_games - a.nr_of_games);
    };
    //this.autoload_these_games = this.gamehistory.slice(0,90).map(g => g.game_id);
  }

}
