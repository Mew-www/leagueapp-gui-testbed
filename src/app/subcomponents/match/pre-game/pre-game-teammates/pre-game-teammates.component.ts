import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../models/dto/summoner";

@Component({
  selector: 'pre-game-teammates',
  templateUrl: './pre-game-teammates.component.html',
  styleUrls: ['./pre-game-teammates.component.scss']
})
export class PreGameTeammatesComponent implements OnInit {

  @Input() teammates: Array<Summoner>;

  constructor() { }

  ngOnInit() {
  }

}
