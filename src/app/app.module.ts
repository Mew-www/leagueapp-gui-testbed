import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { KonamiComponent } from './konami/konami.component';
import {PreferencesService} from "./services/preferences.service";
import {TranslatorService} from "./services/translator.service";
import {StaticApiService} from "./services/static-api.service";
import {PlayerApiService} from "./services/player-api.service";
import {GameApiService} from "./services/game-api.service";
import { SetupComponent } from './subcomponents/setup/setup.component';
import { LanguageSelectorComponent } from './subcomponents/setup/language-selector/language-selector.component';
import { RegionSelectorComponent } from './subcomponents/setup/region-selector/region-selector.component';
import { ProfilingComponent } from './subcomponents/profiling/profiling.component';
import { SummonerSelectorComponent } from './subcomponents/profiling/summoner-selector/summoner-selector.component';
import { SummonerStatisticsComponent } from './subcomponents/profiling/summoner-statistics/summoner-statistics.component';
import { QueuetypeDescriptionPipe } from './pipes/queuetype-description.pipe';
import { SummonerChampionMasteryComponent } from './subcomponents/profiling/summoner-statistics/summoner-champion-mastery/summoner-champion-mastery.component';
import { EmphasiseThousandsPipe } from './pipes/emphasise-thousands.pipe';
import { PlayerGamePreviewComponent } from './subcomponents/profiling/summoner-statistics/player-game-preview/player-game-preview.component';
import { StringifyGameTypePipe } from './pipes/stringify-game-type.pipe';
import { ChampionBanIconComponent } from './genericcomponents/champion-ban-icon/champion-ban-icon.component';
import { SummonerComponent } from './genericcomponents/summoner/summoner.component';
import { PlayerGameDetailsComponent } from './subcomponents/profiling/summoner-statistics/player-game-preview/player-game-details/player-game-details.component';
import { ProfileTypeSelectorComponent } from './subcomponents/profiling/profile-type-selector/profile-type-selector.component';

@NgModule({
  declarations: [
    AppComponent, KonamiComponent,
    SetupComponent, LanguageSelectorComponent, RegionSelectorComponent,
    ProfilingComponent,
    SummonerSelectorComponent,
    SummonerComponent,
    SummonerStatisticsComponent,
    SummonerChampionMasteryComponent,
    PlayerGamePreviewComponent,
    ChampionBanIconComponent,
    QueuetypeDescriptionPipe, EmphasiseThousandsPipe, StringifyGameTypePipe, PlayerGameDetailsComponent, ProfileTypeSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    PreferencesService, TranslatorService,
    StaticApiService, PlayerApiService, GameApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
