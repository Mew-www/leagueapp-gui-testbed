import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../models/dto/summoner";
import {GameType} from "../../../../enums/game-type";

@Component({
  selector: 'pre-game-teammates',
  templateUrl: './pre-game-teammates.component.html',
  styleUrls: ['./pre-game-teammates.component.scss']
})
export class PreGameTeammatesComponent implements OnInit {

  @Input() queue: GameType;
  @Input() teammates: Array<Summoner>;

  private display_icons: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
