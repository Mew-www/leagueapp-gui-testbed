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

  // this.setPref('language_code', "en")
  public setPref = (pref_key, pref_val) => {
    let preferences_object = this.preferences_source.value;
    preferences_object[pref_key] = pref_val;
    window.localStorage.setItem("preferences", JSON.stringify(preferences_object));
    this.preferences_source.next(preferences_object);
  };

  // this.getPref('language_code')
  public getPref(pref_key) {
    let preferences_object = this.preferences_source.value;
    return preferences_object.hasOwnProperty(pref_key) ? preferences_object[pref_key] : null;
  }

}
