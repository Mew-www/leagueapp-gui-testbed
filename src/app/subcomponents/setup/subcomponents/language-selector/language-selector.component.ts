import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {i18n} from "../../../../constants/i18n";
import {TranslatorService} from "../../../../services/translator.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  @Input() active_language; // Component receives the initial language as argument
  @Input() is_initial; // true/false
  @Output() selectedLanguage = new EventEmitter<String>();
  private language_codes_available = Object.keys(i18n.translations);
  private gettext: Function;

  constructor(private translator: TranslatorService) {
    this.gettext = this.translator.getTranslation;
  }

  ngOnInit() {
  }

}
