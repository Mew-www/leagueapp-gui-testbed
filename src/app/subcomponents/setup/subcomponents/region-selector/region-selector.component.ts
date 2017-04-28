import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Settings} from "../../../../constants/settings";

@Component({
  selector: 'app-region-selector',
  templateUrl: './region-selector.component.html',
  styleUrls: ['./region-selector.component.scss']
})
export class RegionSelectorComponent implements OnInit {

  private regions_available = Settings.REGIONS;
  @Input() active_region; // Initially null
  @Output() selectedRegion = new EventEmitter<String>();

  constructor() { }

  ngOnInit() {
  }

}
