import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProfileType} from "../../../enums/profile-type";
import {TranslatorService} from "app/services/translator.service";

@Component({
  selector: 'app-profile-type-selector',
  templateUrl: './profile-type-selector.component.html',
  styleUrls: ['./profile-type-selector.component.scss']
})
export class ProfileTypeSelectorComponent implements OnInit {

  @Output() selectedProfileType = new EventEmitter<ProfileType>();
  private profile_types_available = [
    {'val': ProfileType.CURRENT_GAME, 'text_key': "show_current_game"},
    {'val': ProfileType.HISTORICAL, 'text_key': "show_historical_stats"}
  ];
  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private onProfileTypeChange(new_type) {
    this.selectedProfileType.emit(new_type);
  }

  ngOnInit() {
  }

}
