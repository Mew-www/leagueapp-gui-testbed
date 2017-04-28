import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Settings} from "../../../../constants/settings";
import {TranslatorService} from "../../../../services/translator.service";

@Component({
  selector: 'app-region-selector',
  templateUrl: './region-selector.component.html',
  styleUrls: ['./region-selector.component.scss']
})
export class RegionSelectorComponent implements OnInit {

  @Input() active_region; // Initially null
  @Input() is_initial; // true/false
  @Output() selectedRegion = new EventEmitter<String>();
  private regions_available = Settings.REGIONS;
  private gettext: Function;

  constructor(private translator: TranslatorService) { }

  ngOnInit() {
    this.gettext = this.translator.getTranslation;
  }

}
