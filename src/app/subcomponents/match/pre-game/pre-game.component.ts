import { Component, OnInit } from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";

@Component({
  selector: 'pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {

  private teammates: Array<Summoner> = null;

  constructor() { }

  private handleNewTeammates(teammates) {
    this.teammates = teammates;
  }

  ngOnInit() {
  }

}
