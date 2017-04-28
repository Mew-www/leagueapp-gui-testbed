import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class PreferencesService {

  private preferences_source = new BehaviorSubject<any>({
    // Default preferences
    language_code: 'en'
  });
  public preferences$ = this.preferences_source.asObservable();

  constructor() {
    let saved_preferences = window.localStorage.getItem("preferences");
    if (saved_preferences !== null) {
      this.preferences_source.next(JSON.parse(saved_preferences))
    }
  }

  // Setter: this.preferences = {language_code: "en"};
  set preferences(new_preference_keyvals) {
    let preferences_object = this.preferences_source.value;
    for (let key in new_preference_keyvals) {
      preferences_object[key] = new_preference_keyvals[key];
    }
    window.localStorage.setItem("preferences", JSON.stringify(preferences_object));
    this.preferences_source.next(preferences_object);
  }

  // Getter: var prefs = this.preferences;
  get preferences() {
    return this.preferences_source.value;
  }

}
