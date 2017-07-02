import {Component, Input, OnInit} from '@angular/core';
import {GameType} from "../../../../../../enums/game-type";
import {Analytics} from "../../../../../../helpers/analytics";
import {current} from "codelyzer/util/syntaxKind";

@Component({
  selector: 'previous-roles',
  templateUrl: './previous-roles.component.html',
  styleUrls: ['./previous-roles.component.scss']
})
export class PreviousRolesComponent implements OnInit {

  @Input() soloqueue_games_this_season;
  @Input() flexqueue_games_this_season;
  @Input() soloqueue_games_past_3_weeks;
  @Input() flexqueue_games_past_3_weeks;
  @Input() queueing_for: GameType;
  @Input() role;

  @Input() use_minified: boolean;

  private GameType = GameType;

  constructor() { }

  private getSummaryText() {
    function parseTimeframe(name, preferred_lanes) {
      return {
        name: name,
        primary: preferred_lanes.length > 0 ? preferred_lanes[0] : null,
        secondary: preferred_lanes.length > 1 ? preferred_lanes[1] : null
      }
    }
    let lanes_this_season = this.queueing_for === GameType.SOLO_QUEUE ?
      Analytics.parsePreferredLanes(this.soloqueue_games_this_season || [])
      : Analytics.parsePreferredLanes(this.flexqueue_games_this_season || []);
    let lanes_3_weeks = this.queueing_for === GameType.SOLO_QUEUE ?
      Analytics.parsePreferredLanes(this.soloqueue_games_past_3_weeks || [])
      : Analytics.parsePreferredLanes(this.flexqueue_games_past_3_weeks || []);
    let lanes_max15_games = this.queueing_for === GameType.SOLO_QUEUE ?
      Analytics.parsePreferredLanes(this.soloqueue_games_past_3_weeks || [])
      : Analytics.parsePreferredLanes(this.flexqueue_games_past_3_weeks || []);

    if (lanes_this_season.length === 0) {
      // Not loaded yet or empty
      return '';
    }

    let timeframes = [
      parseTimeframe('This season', lanes_this_season),
      parseTimeframe('Nowadays', lanes_3_weeks),
      parseTimeframe('Recently', lanes_max15_games)
    ];
    // Remove timeframes that follow each other (like if "nowadays" and "recently" are both same as "this season", just leave "this season"
    // Champions will be included anyway since latter ones are subsets of former ones
    let previous_timeframe = null;
    timeframes = timeframes.reduce((acc, timeframe) => {
      if (previous_timeframe === null) {
        acc.push(timeframe);
        previous_timeframe = timeframe;
      } else {
        let previous_primary = previous_timeframe.primary ? previous_timeframe.primary.lane_name : null;
        let previous_secondary = previous_timeframe.secondary ? previous_timeframe.secondary.lane_name : null;
        let current_primary = timeframe.primary ? timeframe.primary.lane_name : null;
        let current_secondary = timeframe.secondary ? timeframe.secondary.lane_name : null;
        if (previous_primary !== current_primary || previous_secondary !== current_secondary) {
          acc.push(timeframe);
        }
        previous_timeframe = timeframe;
      }
      return acc;
    }, []);

    let summary = "";
    for (let t of timeframes) {
      if (summary.length) {
        summary += '\n';
      }
      summary += `${t.name} ${t.primary.lane_name} (${t.primary.percentage}%)` + (t.primary.champions.length===1?' ('+t.primary.champions[0].champion.name+' only)':'');
      if (t.secondary) {
        summary += ` > ${t.secondary.lane_name} (${t.secondary.percentage}%)` + (t.secondary.champions.length===1?' ('+t.secondary.champions[0].champion.name+' only)':'');
      }
      summary += '.';
    }
    return summary;
  }

  ngOnInit() {
  }

}
