import { Injectable } from '@angular/core';
import {i18n} from '../constants/i18n';
import {PreferencesService} from "./preferences.service";

@Injectable()
export class TranslatorService {

  private translations = i18n.translations;
  private current_language: string; // Gets overridden by initial preferences

  constructor(private preferencesService: PreferencesService) {
    // Control language choice from preferences
    this.preferencesService.preferences$
      .subscribe((new_preferences) => {
        this.current_language = new_preferences["language_code"];
      });
  }

  public getTranslation = (phrase_id, opt_alt_language?) => {
    let language = opt_alt_language ? opt_alt_language : this.current_language;

    if (!this.translations.hasOwnProperty(language)) {
      throw new Error(`Attempted to find translation from non-configured language '${language}'`);
    }
    if (!this.translations[language].hasOwnProperty(phrase_id)) {
      throw new Error(`Attempted to find translation of non-configured phrase '${phrase_id}' from language ${language}`);
    }
    return this.translations[language][phrase_id];
  };
}
