import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {GameReference} from "../../../../../models/dto/game-reference";
import {ChampionsContainer} from "../../../../../models/dto/containers/champions-container";
import {Champion} from "../../../../../models/dto/champion";
import {TranslatorService} from "../../../../../services/translator.service";
import {Analytics} from "../../../../../helpers/analytics";
import {GameType} from "../../../../../enums/game-type";

@Component({
  selector: 'participant-played-champions',
  templateUrl: './participant-played-champions.component.html',
  styleUrls: ['./participant-played-champions.component.scss']
})
export class ParticipantPlayedChampionsComponent implements OnInit, OnChanges {

  @Input() currently_played_champion: Champion;
  @Input() gamehistory: Array<GameReference>;
  @Input() gametype: GameType;
  @Input() show_also_secondary_queue_stats: boolean = false;

  // Metadata
  @Input() champions: ChampionsContainer;

  @Output() toggledPlayedChampionDetails = new EventEmitter();

  private top_played_champions: Array<any> = null; // {order, champion, nr_of_games, lanes}
  private non_top_current_champion = null; // {order, champion, nr_of_games, lanes}
  private top_played_champions_altqueue: Array<any> = null;
  private non_top_current_champion_altqueue = null; // {order, champion, nr_of_games, lanes}

  private minimized = true;

  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private getAltQueueName() {
    return this.gametype === GameType.SOLO_QUEUE ? "Flex" : "Solo";
  }

  private getTimeAgoAsString(date: Date) {
    if (!date) {
      return this.gettext('never');
    }

    let time_difference_ms = new Date().getTime() - date.getTime(); // now - then
    let local_yesterday_begin = ((new Date()).getHours() + 24) * 1000 * 60 * 60; // (Hours today + 24 hours) earlier

    if (time_difference_ms < 1000*60*60*24) {
      // Less-than-day ago
      let full_hours_ago = Math.floor(time_difference_ms / (1000*60*60));
      if (full_hours_ago == 0) {
        // Count minutes instead
        let full_minutes_ago = Math.floor(time_difference_ms / (1000*60));
        if (full_minutes_ago == 0) {
          return `${this.gettext("just_now")}`;
        }
        if (full_minutes_ago == 1) {
          return `1 ${this.gettext("minute_ago")}`;
        }
        // Else
        return `${full_minutes_ago} ${this.gettext("n_minutes_ago")}`;
      }
      if (full_hours_ago == 1) {
        return `1  ${this.gettext("hour_ago")}`;
      }
      // Else
      return `${full_hours_ago} ${this.gettext("n_hours_ago")}`;

    } else if (time_difference_ms < local_yesterday_begin) {
      // Since (local-/browsertime) "yesterday" began
      return this.gettext("yesterday");

    } else {
      // DD. MM. YYYY
      return ("0"+date.getDate()).slice(-2) + '.' + ("0"+(date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    }
  }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes['gamehistory'].currentValue === changes['gamehistory'].previousValue) {
      return;
    }

    this.top_played_champions = null;
    this.non_top_current_champion = null;

    // Optional
    this.top_played_champions_altqueue = null;
    this.non_top_current_champion_altqueue = null;

    let altqueue_type = this.gametype === GameType.SOLO_QUEUE ? GameType.FLEX_QUEUE : GameType.SOLO_QUEUE;

    let played_champions_mainqueue = Analytics.parsePlayedChampions(this.gamehistory.filter(gameref => gameref.game_type === this.gametype), this.champions)
      .sort((a, b) => b.nr_of_games - a.nr_of_games);

    let played_champions_altqueue = Analytics.parsePlayedChampions(this.gamehistory.filter(gameref => gameref.game_type === altqueue_type), this.champions)
      .sort((a, b) => b.nr_of_games - a.nr_of_games);

    // Populate top-played-champions
    this.top_played_champions = played_champions_mainqueue
      .slice(0, 5)
      .map(most_played_champion => Analytics.addPlayedChampionLanesCalculations(most_played_champion));

    // Populate possible non-top current-champion
    if (!this.top_played_champions.find(c => c.champion.id === this.currently_played_champion.id)) {
      // If current champion isn't in top played, add it manually as separate
      let seen_current_champion = played_champions_mainqueue.find(c => c.champion.id === this.currently_played_champion.id);
      if (seen_current_champion) {
        this.non_top_current_champion = seen_current_champion;
        this.non_top_current_champion = Analytics.addPlayedChampionLanesCalculations(this.non_top_current_champion);
        this.non_top_current_champion['order'] = played_champions_mainqueue.map(c => c.champion.id).indexOf(this.currently_played_champion.id)+1;
      } else {
        this.non_top_current_champion = {
          order: -1,
          champion: this.currently_played_champion,
          nr_of_games: 0,
          lanes: []
        };
      }
    }

    // Populate optional altqueue top-played-champions
    if (this.gamehistory.filter(gameref => gameref.game_type === altqueue_type).length > 0) {
      this.top_played_champions_altqueue = played_champions_altqueue
        .slice(0, 5)
        .map(most_played_champion => Analytics.addPlayedChampionLanesCalculations(most_played_champion));

      // Populate optional possible altqueue non-top current-champion
      if (!this.top_played_champions_altqueue.find(c => c.champion.id === this.currently_played_champion.id)) {
        // If current champion isn't in top played, add it manually as separate
        let seen_current_champion = played_champions_altqueue.find(c => c.champion.id === this.currently_played_champion.id);
        if (seen_current_champion) {
          this.non_top_current_champion_altqueue = seen_current_champion;
          this.non_top_current_champion_altqueue = Analytics.addPlayedChampionLanesCalculations(this.non_top_current_champion_altqueue);
          this.non_top_current_champion_altqueue['order'] = played_champions_altqueue.map(c => c.champion.id).indexOf(this.currently_played_champion.id)+1;
        } else {
          this.non_top_current_champion_altqueue = null;
        }
      }
    }
  }
}
