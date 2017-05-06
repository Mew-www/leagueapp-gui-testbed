import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../models/summoner";

@Component({
  selector: 'summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnInit {

  @Input() summoner: Summoner;

  constructor() { }

  ngOnInit() {
  }

}
