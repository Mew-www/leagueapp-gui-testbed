import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GameReference} from "../../../../../../models/dto/game-reference";
import {Analytics} from "../../../../../../helpers/analytics";

@Component({
  selector: 'preferred-lanes',
  templateUrl: './preferred-lanes.component.html',
  styleUrls: ['./preferred-lanes.component.scss']
})
export class PreferredLanesComponent implements OnInit, OnChanges {

  @Input() chosen_lane = null; // Optional
  @Input() slice_of_gamehistory: Array<GameReference>; // Required

  private preferred_lanes = null;
  // Utils
  private Math = Math;

  constructor() { }

  ngOnInit() {
    this.preferred_lanes = Analytics.parsePreferredLanes(this.slice_of_gamehistory);
  }

  ngOnChanges(changes) {
    let input_gamehistory = changes['slice_of_gamehistory'];
    if (this.preferred_lanes !== null && input_gamehistory.previousValue !== input_gamehistory.currentValue) {
      this.preferred_lanes = Analytics.parsePreferredLanes(input_gamehistory.currentValue);
    }
  }

}
