import {Component, Input, OnInit} from '@angular/core';
import {LeaguePosition} from "../../../../../../models/dto/league-position";
import {RankedTier} from "../../../../../../enums/ranked-tier";
import {GameType} from "../../../../../../enums/game-type";
import {Settings} from "../../../../../../constants/settings";

@Component({
  selector: 'teammate-league-position',
  templateUrl: './teammate-league-position.component.html',
  styleUrls: ['./teammate-league-position.component.scss']
})
export class TeammateLeaguePositionComponent implements OnInit {

  @Input() primary: boolean;
  @Input() league_position: LeaguePosition;

  private unranked_badge_img_uri   = Settings.STATIC_BASE_URI + "unranked_emblem.png";
  private bronze_badge_img_uri     = Settings.STATIC_BASE_URI + "bronze_emblem.png";
  private silver_badge_img_uri     = Settings.STATIC_BASE_URI + "silver_emblem.png";
  private gold_badge_img_uri       = Settings.STATIC_BASE_URI + "gold_emblem.png";
  private platinum_badge_img_uri   = Settings.STATIC_BASE_URI + "platinum_emblem.png";
  private diamond_badge_img_uri    = Settings.STATIC_BASE_URI + "diamond_emblem.png";
  private master_badge_img_uri     = Settings.STATIC_BASE_URI + "master_emblem.png";
  private challenger_badge_img_uri = Settings.STATIC_BASE_URI + "challenger_emblem.png";

  private Math = Math;

  constructor() { }

  private getTierString() {
    switch(this.league_position.tier) {
      case RankedTier.UNRANKED:
        return "Unranked";
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

  private getTierIconUri() {
    switch(this.league_position.tier) {
      case RankedTier.UNRANKED:
        return this.unranked_badge_img_uri;
      case RankedTier.BRONZE:
        return this.bronze_badge_img_uri;
      case RankedTier.SILVER:
        return this.silver_badge_img_uri;
      case RankedTier.GOLD:
        return this.gold_badge_img_uri;
      case RankedTier.PLATINUM:
        return this.platinum_badge_img_uri;
      case RankedTier.DIAMOND:
        return this.diamond_badge_img_uri;
      case RankedTier.MASTER:
        return this.master_badge_img_uri;
      case RankedTier.CHALLENGER:
        return this.challenger_badge_img_uri;
      default:
        return '404.png'
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
