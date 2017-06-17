import {Component, Input, OnInit} from '@angular/core';
import {LeaguePosition} from "../../../../../../models/dto/league-position";
import {RankedTier} from "../../../../../../enums/ranked-tier";
import {GameType} from "../../../../../../enums/game-type";

@Component({
  selector: 'teammate-league-position',
  templateUrl: './teammate-league-position.component.html',
  styleUrls: ['./teammate-league-position.component.scss']
})
export class TeammateLeaguePositionComponent implements OnInit {

  @Input() primary: boolean;
  @Input() league_position: LeaguePosition;

  private Math = Math;

  constructor() { }

  private getTierString() {
    switch(this.league_position.tier) {
      case RankedTier.BRONZE:
        return "Bronze";
      case RankedTier.SILVER:
        return "Silver";
      case RankedTier.GOLD:
        return "Gold";
      case RankedTier.PLATINUM:
        return "Platinum";
      case RankedTier.DIAMOND:
        return "Diamond";
      case RankedTier.MASTER:
        return "Master";
      case RankedTier.CHALLENGER:
        return "Challenger";
      default:
        return 'Undefined-RankedTier'
    }
  }

  private getQueueString() {
    switch (this.league_position.queue) {
      case GameType.SOLO_QUEUE:
        return 'solo_queue';
      case GameType.FLEX_QUEUE_5V5:
        return 'flex_queue';
      case GameType.FLEX_QUEUE_3V3:
        return 'flex_queue_tt';
      default:
        return 'Undefined-Queue';
    }
  }

  ngOnInit() {
  }

}
