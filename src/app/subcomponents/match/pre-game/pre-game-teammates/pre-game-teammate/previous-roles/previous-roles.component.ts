import {Component, Input, OnInit} from '@angular/core';
import {GameType} from "../../../../../../enums/game-type";

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

  private GameType = GameType;

  constructor() { }

  ngOnInit() {
  }

}
