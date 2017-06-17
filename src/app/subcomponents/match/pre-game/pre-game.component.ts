import { Component, OnInit } from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";
import {GameType} from "../../../enums/game-type";

@Component({
  selector: 'pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {

  private queue_type: GameType = null;
  private teammates: Array<Summoner> = null;

  constructor() { }

  private handleChosenQueueType(queue_type) {
    this.queue_type = queue_type;
  }

  private handleNewTeammates(teammates) {
    this.teammates = teammates;
  }

  ngOnInit() {
  }

}
