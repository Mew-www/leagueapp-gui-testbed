import {Component, Input, OnInit} from '@angular/core';
import {LeaguePosition} from "../../../../../../models/dto/league-position";
import {RankedTier} from "../../../../../../enums/ranked-tier";
import {GameType} from "../../../../../../enums/game-type";
import {Settings} from "../../../../../../constants/settings";
import {Summoner} from "../../../../../../models/dto/summoner";
import {RatelimitedRequestsService} from "../../../../../../services/ratelimited-requests.service";
import {PlayerApiService} from "../../../../../../services/player-api.service";
import {ResType} from "../../../../../../enums/api-response-type";
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'teammate-league-position',
  templateUrl: './teammate-league-position.component.html',
  styleUrls: ['./teammate-league-position.component.scss']
})
export class TeammateLeaguePositionComponent implements OnInit {

  @Input() summoner: Summoner;
  private loaded_rankings: Array<LeaguePosition> = null;
  private errors = [];

  private unranked_badge_img_uri   = Settings.STATIC_BASE_URI + "unranked_emblem.png";
  private bronze_badge_img_uri     = Settings.STATIC_BASE_URI + "bronze_emblem.png";
  private silver_badge_img_uri     = Settings.STATIC_BASE_URI + "silver_emblem.png";
  private gold_badge_img_uri       = Settings.STATIC_BASE_URI + "gold_emblem.png";
  private platinum_badge_img_uri   = Settings.STATIC_BASE_URI + "platinum_emblem.png";
  private diamond_badge_img_uri    = Settings.STATIC_BASE_URI + "diamond_emblem.png";
  private master_badge_img_uri     = Settings.STATIC_BASE_URI + "master_emblem.png";
  private challenger_badge_img_uri = Settings.STATIC_BASE_URI + "challenger_emblem.png";

  private gettext: Function;
  private GameType = GameType;
  private Math = Math;

  constructor(private buffered_requests: RatelimitedRequestsService,
              private player_api: PlayerApiService,
              private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private getTierString(league_position) {
    switch(league_position.tier) {
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

  private getSubTierString(league_position) {
    switch(league_position.sub_tier) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
      case 5:
        return "V";
      default:
        return 'Undefined-RankedSubTier'
    }
  }

  private getTierIconUri(league_position) {
    switch(league_position.tier) {
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

  private sortByQueue(a: LeaguePosition, b: LeaguePosition) {
    let order = [GameType.SOLO_QUEUE, GameType.FLEX_QUEUE_5V5, GameType.FLEX_QUEUE_3V3];
    return order.indexOf(a.queue) - order.indexOf(b.queue);
  }

  private mapToQueue(lea: LeaguePosition) {
    return lea.queue;
  }

  ngOnInit() {
    // Autoload rankings
    this.buffered_requests.buffer(() => {
      return this.player_api.getRankings(this.summoner.region, this.summoner.id);
    })
      .subscribe(api_res => {
        if (api_res.type === ResType.SUCCESS) {
          this.loaded_rankings = api_res.data;
        }
        if (api_res.type === ResType.NOT_FOUND) {
          this.loaded_rankings = [];
        }
        if (api_res.type === ResType.ERROR) {
          this.errors.push(JSON.stringify(api_res.error));
        }
      });
  }

}
