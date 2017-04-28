import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {i18n} from "../../../../constants/i18n";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  private language_codes_available = Object.keys(i18n.translations);
  @Input() active_language; // Component receives the initial language as argument
  @Output() selectedLanguage = new EventEmitter<String>();

  constructor() { }

  ngOnInit() {
  }

}
