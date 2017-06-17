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
import { SummonerChampionMasteryComponent } from './subcomponents/profiling/summoner-statistics/summoner-champion-mastery-scroller/summoner-champion-mastery/summoner-champion-mastery.component';
import { EmphasiseThousandsPipe } from './pipes/emphasise-thousands.pipe';
import { PlayerGamePreviewComponent } from './subcomponents/profiling/summoner-statistics/summoner-gamehistory/player-game-preview/player-game-preview.component';
import { StringifyGameTypePipe } from './pipes/stringify-game-type.pipe';
import { ChampionBanIconComponent } from './genericcomponents/champion-ban-icon/champion-ban-icon.component';
import { SummonerComponent } from './genericcomponents/summoner/summoner.component';
import { PlayerGameDetailsComponent } from './subcomponents/profiling/summoner-statistics/summoner-gamehistory/player-game-preview/player-game-details/player-game-details.component';
import { ProfileTypeSelectorComponent } from './subcomponents/profiling/profile-type-selector/profile-type-selector.component';
import { SummonerChampionMasteryScrollerComponent } from './subcomponents/profiling/summoner-statistics/summoner-champion-mastery-scroller/summoner-champion-mastery-scroller.component';
import { SummonerGamehistoryComponent } from './subcomponents/profiling/summoner-statistics/summoner-gamehistory/summoner-gamehistory.component';
import {RatelimitedRequestsService} from "./services/ratelimited-requests.service";
import { CurrentGameComponent } from './subcomponents/profiling/current-game/current-game.component';
import { CurrentGameParticipantStatisticsComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/current-game-participant-statistics.component';
import { SummonerSpellIconComponent } from './genericcomponents/summoner-spell-icon/summoner-spell-icon.component';
import { ParticipantPlayedChampionsComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/participant-played-champions/participant-played-champions.component';
import { PlayedChampionDetailsComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/played-champion-details/played-champion-details.component';
import { ExplorerComponent } from './subcomponents/explorer/explorer.component';
import {ExplorerApiService} from "./services/explorer-api.service";
import { StartingItemsHistoryComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/played-champion-details/starting-items-history/starting-items-history.component';
import { FinishedItemsHistoryComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/played-champion-details/finished-items-history/finished-items-history.component';
import { WinrateGraphComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/played-champion-details/winrate-graph/winrate-graph.component';
import { FirstbloodHistoryComponent } from './subcomponents/profiling/current-game/current-game-participant-statistics/played-champion-details/firstblood-history/firstblood-history.component';
import {RouterModule, Routes} from "@angular/router";
import { MatchComponent } from './subcomponents/match/match.component';
import { PreGameComponent } from './subcomponents/match/pre-game/pre-game.component';
import { PreGameChatparserComponent } from './subcomponents/match/pre-game/pre-game-chatparser/pre-game-chatparser.component';
import { PreGameTeammatesComponent } from './subcomponents/match/pre-game/pre-game-teammates/pre-game-teammates.component';
import {DragulaModule} from "ng2-dragula";

const routes: Routes = [
  {'path': "summoner", component: ProfilingComponent},
  {'path': "match", component: MatchComponent},
  {'path': "**", component: ProfilingComponent}
];

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
    QueuetypeDescriptionPipe, EmphasiseThousandsPipe, StringifyGameTypePipe,
    PlayerGameDetailsComponent,
    ProfileTypeSelectorComponent,
    SummonerChampionMasteryScrollerComponent,
    SummonerGamehistoryComponent,
    CurrentGameComponent,
    CurrentGameParticipantStatisticsComponent,
    SummonerSpellIconComponent,
    ParticipantPlayedChampionsComponent,
    PlayedChampionDetailsComponent,
    ExplorerComponent,
    StartingItemsHistoryComponent,
    FinishedItemsHistoryComponent,
    WinrateGraphComponent,
    FirstbloodHistoryComponent,
    MatchComponent,
    PreGameComponent,
    PreGameChatparserComponent,
    PreGameTeammatesComponent
  ],
  imports: [
    DragulaModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    PreferencesService, TranslatorService,
    StaticApiService, PlayerApiService, GameApiService,
    RatelimitedRequestsService,
    ExplorerApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
