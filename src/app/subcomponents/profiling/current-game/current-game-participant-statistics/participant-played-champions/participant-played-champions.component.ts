import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameReference} from "../../../../../models/dto/game-reference";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {Champion} from "../../../../../models/dto/champion";
import {TranslatorService} from "../../../../../services/translator.service";

@Component({
  selector: 'participant-played-champions',
  templateUrl: './participant-played-champions.component.html',
  styleUrls: ['./participant-played-champions.component.scss']
})
export class ParticipantPlayedChampionsComponent implements OnInit, OnChanges {

  @Input() currently_played_champion: Champion;
  @Input() gamehistory: Array<GameReference>;
  @Input() champions: ChampionsContainer;
  private top_played_champions: Array<any> = null; // {champion, nr_of_games, lanes}
  private non_top_current_champion = null; // {order, champion, nr_of_games, lanes}

  private minimized = true;

  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes['gamehistory'].currentValue === changes['gamehistory'].previousValue) {
      return;
    }

    this.top_played_champions = null;
    this.non_top_current_champion = null;

    let played_champions = this.gamehistory.reduce((seen_champions, gameref: GameReference) => {
      let seen_champion = seen_champions.find(s => s.champion.id === gameref.chosen_champion.id);
      let lane = gameref.in_select_lane;
      if (!seen_champion) {
        seen_champion = {
          champion: this.champions.getChampionById(gameref.chosen_champion.id),
          nr_of_games: 0,
          lanes: {}
        };
        seen_champions.push(seen_champion);
      }

      if (Object.keys(seen_champion.lanes).indexOf(lane) === -1) {
        seen_champion.lanes[lane] = 0;
      }
      seen_champion.nr_of_games++;
      seen_champion.lanes[lane]++;
      return seen_champions;
    }, []).sort((a, b) => b.nr_of_games - a.nr_of_games);

    this.top_played_champions = played_champions
      .slice(0, 5)
      .map(most_played_champion => {
        most_played_champion.lanes = Object.keys(most_played_champion.lanes).map(lane => {
          return {
            lane_name: lane,
            times_played: most_played_champion.lanes[lane],
            times_played_percent: Math.round(most_played_champion.lanes[lane] / most_played_champion.nr_of_games * 100) > 0 ?
              Math.round(most_played_champion.lanes[lane] / most_played_champion.nr_of_games * 100)
              :
              Number((most_played_champion.lanes[lane] / most_played_champion.nr_of_games * 100).toFixed(2))
          };
        }).sort((a,b) => b.times_played_percent - a.times_played_percent);
        return most_played_champion;
      });

    if (!this.top_played_champions.find(c => c.champion.id === this.currently_played_champion.id)) {
      // Add it manually as separate
      let seen_current_champion = played_champions.find(c => c.champion.id === this.currently_played_champion.id);
      if (seen_current_champion) {
        this.non_top_current_champion = seen_current_champion;
        this.non_top_current_champion.lanes = Object.keys(this.non_top_current_champion.lanes).map(lane => {
          return {
            lane_name: lane,
            times_played: this.non_top_current_champion.lanes[lane],
            times_played_percent: Math.round(this.non_top_current_champion.lanes[lane] / this.non_top_current_champion.nr_of_games * 100)
          };
        });
        this.non_top_current_champion['order'] = played_champions.map(c => c.champion.id).indexOf(this.currently_played_champion.id)+1;
      } else {
        this.non_top_current_champion = {
          order: -1,
          champion: this.currently_played_champion,
          nr_of_games: 0,
          lanes: []
        };
      }
    }
  }

}
