import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../models/summoner";

@Component({
  selector: 'profiling',
  templateUrl: './profiling.component.html',
  styleUrls: ['./profiling.component.scss']
})
export class ProfilingComponent implements OnInit {

  @Input() champions_metadata;
  @Input() items_metadata;
  private selected_summoner: Summoner = null;

  constructor() { }

  public handleSummonerChanged(new_selected_summoner) {
    this.selected_summoner = new_selected_summoner;
  }

  ngOnInit() {}

}