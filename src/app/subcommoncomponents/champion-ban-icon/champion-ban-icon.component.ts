import {Component, Input, OnInit} from '@angular/core';
import {Champion} from "../../models/champion";

@Component({
  selector: 'champion-ban-icon',
  templateUrl: './champion-ban-icon.component.html',
  styleUrls: ['./champion-ban-icon.component.scss']
})
export class ChampionBanIconComponent implements OnInit {

  @Input() size = "50"; // px
  @Input() champion: Champion;
  constructor() { }

  ngOnInit() {
  }

}
