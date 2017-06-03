import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameReference} from "../../../../../models/dto/game-reference";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {Champion} from "../../../../../models/dto/champion";
import {TranslatorService} from "../../../../../services/translator.service";
import {Analytics} from "../../../../../helpers/analytics";

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

    let played_champions = Analytics.parsePlayedChampions(this.gamehistory, this.champions);

    this.top_played_champions = played_champions
      .sort((a, b) => b.nr_of_games - a.nr_of_games)
      .slice(0, 5)
      .map(most_played_champion => Analytics.addPlayedChampionLanesCalculations(most_played_champion));

    if (!this.top_played_champions.find(c => c.champion.id === this.currently_played_champion.id)) {
      // If current champion isn't in top played, add it manually as separate
      let seen_current_champion = played_champions.find(c => c.champion.id === this.currently_played_champion.id);
      if (seen_current_champion) {
        this.non_top_current_champion = seen_current_champion;
        this.non_top_current_champion = Analytics.addPlayedChampionLanesCalculations(this.non_top_current_champion);
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
