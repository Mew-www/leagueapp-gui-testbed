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
import { LanguageSelectorComponent } from './subcomponents/setup/subcomponents/language-selector/language-selector.component';
import { RegionSelectorComponent } from './subcomponents/setup/subcomponents/region-selector/region-selector.component';
import { ProfilingComponent } from './subcomponents/profiling/profiling.component';
import { SummonerSelectorComponent } from './subcomponents/profiling/subcomponents/summoner-selector/summoner-selector.component';
import { StatisticsComponent } from './subcomponents/profiling/subcomponents/statistics/statistics.component';
import { QueuetypeDescriptionPipe } from './pipes/queuetype-description.pipe';
import { PlayerChampionMasteryComponent } from './subcomponents/profiling/subcomponents/statistics/subcomponents/player-champion-mastery/player-champion-mastery.component';
import { EmphasiseThousandsPipe } from './pipes/emphasise-thousands.pipe';
import { PlayerGamePreviewComponent } from './subcomponents/profiling/subcomponents/statistics/subcomponents/player-game-preview/player-game-preview.component';
import { StringifyGameTypePipe } from './pipes/stringify-game-type.pipe';
import { ChampionBanIconComponent } from './subcommoncomponents/champion-ban-icon/champion-ban-icon.component';
import { SummonerComponent } from './subcommoncomponents/summoner/summoner.component';

@NgModule({
  declarations: [
    AppComponent,
    KonamiComponent,
    SetupComponent,
    LanguageSelectorComponent,
    RegionSelectorComponent,
    ProfilingComponent,
    SummonerSelectorComponent,
    StatisticsComponent,
    QueuetypeDescriptionPipe,
    PlayerChampionMasteryComponent,
    EmphasiseThousandsPipe,
    PlayerGamePreviewComponent,
    StringifyGameTypePipe,
    ChampionBanIconComponent,
    SummonerComponent
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
