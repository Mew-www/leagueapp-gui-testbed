import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PreferencesService} from "../../services/preferences.service";
import {TranslatorService} from "../../services/translator.service";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  @Output() setupReady = new EventEmitter<boolean>();

  private initial_preferences_loaded: boolean = false;
  private initialised: boolean                = false;
  private current_language_code = null;
  private current_region = null;

  constructor(private preferencesService: PreferencesService,
              private translator: TranslatorService) { }

  public changeLanguage(new_language_code) {
    this.preferencesService.preferences = {'language_code': new_language_code};
    console.log("Setup changed language to " + new_language_code);
  }

  public changeRegion(new_region) {
    if (this.current_region === null) {
      this.preferencesService.preferences = {'region': new_region};
      console.log("Setup changed region to " + new_region);
    } else {
      let sure = window.confirm(this.translator.getTranslation('are_you_sure_to_change_region'));
      if (sure) {
        this.preferencesService.preferences = {'region': new_region};
        console.log("Setup changed region to " + new_region);
      }
    }
  }

  ngOnInit() {
    this.preferencesService.preferences$
      .subscribe(new_prefs => {
        // First new_prefs include initial settings, possibly loaded from localStorage after previous app use.
        // this.initialised remains false until a region is selected.
        // Technically: this.initialised.equals(this.current_region !== null),
        // but keeping them separate for future cases, if there were to be more (multiple) initialisation conditions.
        if (!this.initialised && new_prefs.hasOwnProperty('region')) {
          this.current_region = new_prefs.region;
          // Finally selected region for first time -> we ready, leggo d(^.^)b
          this.initialised = true;
          this.setupReady.emit(true);
        } else {
          // On-prefs-change post-initialisation (REMINDER: THIS HAPPENS EVEN IF ONLY PART OF PREFERENCES ARE CHANGED)
          if (new_prefs.hasOwnProperty('region') && new_prefs.region !== this.current_region) {
            this.current_region = new_prefs.region; // Update only if changed
          }
        }
        // On-prefs-change regardless initialisation state
        this.current_language_code = new_prefs.language_code; // Here'd be if(!initial && changed) => "languageChanged"
        if (!this.initial_preferences_loaded) {
          this.initial_preferences_loaded = true;
        }
      });
  }

}
