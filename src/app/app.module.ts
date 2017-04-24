import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { KonamiComponent } from './konami/konami.component';
import {PreferencesService} from "./services/preferences.service";
import {TranslatorService} from "./services/translator.service";

@NgModule({
  declarations: [
    AppComponent,
    KonamiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [PreferencesService, TranslatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
