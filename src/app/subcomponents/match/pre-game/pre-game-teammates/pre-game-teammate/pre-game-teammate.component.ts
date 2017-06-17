import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../../models/dto/summoner";
import {LeaguePosition} from "../../../../../models/dto/league-position";
import {PlayerApiService} from "../../../../../services/player-api.service";
import {RatelimitedRequestsService} from "../../../../../services/ratelimited-requests.service";
import {ResType} from "../../../../../enums/api-response-type";
import {GameType} from "../../../../../enums/game-type";

@Component({
  selector: 'pre-game-teammate',
  templateUrl: './pre-game-teammate.component.html',
  styleUrls: ['./pre-game-teammate.component.scss']
})
export class PreGameTeammateComponent implements OnInit {

  @Input() summoner: Summoner;
  @Input() queueing_for: GameType;
  @Input() display_summoner_icon: boolean = false;

  private loaded_rankings: Array<LeaguePosition> = null;
  private error = "";

  constructor(private player_api: PlayerApiService,
              private buffered_requests: RatelimitedRequestsService) {
  }

  private getMeaningfulLeaguePosition() {
    if (!this.loaded_rankings) {
      return '';
    }
    // Primary -> this queue
    let primary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === this.queueing_for);
    if (primary_queue_ranking) {
      return primary_queue_ranking;
    }
    // Firsttime SOLO/DUO ? -> FLEX 5v5 -> FLEX 3v3
    if (this.queueing_for === GameType.SOLO_QUEUE) {
      let secondary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.FLEX_QUEUE_5V5);
      if (secondary_queue_ranking) {
        return secondary_queue_ranking;
      } else {
        let tertiary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.FLEX_QUEUE_3V3);
        if (tertiary_queue_ranking) {
          return tertiary_queue_ranking;
        }
      }
    }
    // Firsttime FLEX 5v5? -> SOLO/DUO -> FLEX 3v3
    if (this.queueing_for === GameType.FLEX_QUEUE_5V5) {
      let secondary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.SOLO_QUEUE);
      if (secondary_queue_ranking) {
        return secondary_queue_ranking;
      } else {
        let tertiary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.FLEX_QUEUE_3V3);
        if (tertiary_queue_ranking) {
          return tertiary_queue_ranking;
        }
      }
    }
    // Firsttime FLEX 3v3? -> FLEX 5v5 -> SOLO/DUO
    if (this.queueing_for === GameType.FLEX_QUEUE_3V3) {
      let secondary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.FLEX_QUEUE_5V5);
      if (secondary_queue_ranking) {
        return secondary_queue_ranking;
      } else {
        let tertiary_queue_ranking = this.loaded_rankings.find(lea => lea.queue === GameType.SOLO_QUEUE);
        if (tertiary_queue_ranking) {
          return tertiary_queue_ranking;
        }
      }
    }
  }

  ngOnInit() {
    this.buffered_requests.buffer(() => {
      return this.player_api.getRankings(this.summoner.region, this.summoner.id);
    })
      .subscribe(api_res => {
        if (api_res.type === ResType.SUCCESS) {
          this.loaded_rankings = api_res.data;
        }
        if (api_res.type === ResType.NOT_FOUND) {
          this.error = "Player has no previous rankings?";
        }
        if (api_res.type === ResType.ERROR) {
          this.error = api_res.error;
        }
      });
  }

}
