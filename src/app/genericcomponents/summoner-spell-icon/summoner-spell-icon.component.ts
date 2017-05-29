import {Component, Input, OnInit} from '@angular/core';
import {SummonerSpell} from "../../models/dto/summoner-spell";

@Component({
  selector: 'summoner-spell-icon',
  templateUrl: './summoner-spell-icon.component.html',
  styleUrls: ['./summoner-spell-icon.component.scss']
})
export class SummonerSpellIconComponent implements OnInit {

  @Input() size = "20"; // px
  @Input() summoner_spell: SummonerSpell;
  constructor() { }

  ngOnInit() {
  }

}