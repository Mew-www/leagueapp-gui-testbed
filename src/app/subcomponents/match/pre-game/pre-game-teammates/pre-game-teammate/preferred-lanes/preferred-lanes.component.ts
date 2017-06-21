import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameReference} from "../../../../../../models/dto/game-reference";
import {Analytics} from "../../../../../../helpers/analytics";
import {TranslatorService} from "../../../../../../services/translator.service";

@Component({
  selector: 'preferred-lanes',
  templateUrl: './preferred-lanes.component.html',
  styleUrls: ['./preferred-lanes.component.scss']
})
export class PreferredLanesComponent implements OnInit, OnChanges {

  @Input() check_autofill = false; // Optional
  @Input() chosen_lane = null; // Optional
  @Input() slice_of_gamehistory: Array<GameReference>; // Required

  private preferred_lanes = null;
  // Utils
  private gettext: Function;
  private Math = Math;

  constructor(private translator: TranslatorService) {
    this.gettext = translator.getTranslation;
  }

  private mapToLaneName(lane) {
    return lane.lane_name;
  }

  ngOnInit() {
    this.preferred_lanes = Analytics.parsePreferredLanes(this.slice_of_gamehistory);
  }

  ngOnChanges(changes) {
    let changed_gamehistory = changes['slice_of_gamehistory'];
    if (this.preferred_lanes !== null && changed_gamehistory && changed_gamehistory.previousValue !== changed_gamehistory.currentValue) {
      this.preferred_lanes = Analytics.parsePreferredLanes(changed_gamehistory.currentValue);
    }
  }

}
