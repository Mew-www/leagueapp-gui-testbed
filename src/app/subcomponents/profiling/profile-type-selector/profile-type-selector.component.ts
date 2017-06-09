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
    {'val': ProfileType.HISTORICAL, 'text_key': "show_historical_stats"},
    {'val': ProfileType.EXPLORER, 'text_key': "dev_env"},
    {'val': ProfileType.NOTHINGNESS, 'text_key': "yesterday"}
  ];
  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  private onProfileTypeChange(new_type) {
    if (new_type == ProfileType.EXPLORER) {
      let definitely_not_a_secret_key = window.prompt('Passphrase?');
      // 'flowerpower'
      if (definitely_not_a_secret_key !== '\u0066\u006C\u006F\u0077\u0065\u0072\u0070\u006F\u0077\u0065\u0072') {
        alert('No. :<');
        return;
      }
    }
    this.selectedProfileType.emit(new_type);
  }

  ngOnInit() {
  }

}
