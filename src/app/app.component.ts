import { Component } from '@angular/core';
import {StaticApiService} from "./services/static-api.service";
import {ResType} from "./enums/api-response-type";
import {Observable} from "rxjs/Observable";
import {ChampionsContainer} from "./models/dto/containers/champions-container";
import {ItemsContainer} from "./models/dto/containers/items-container";
import {SummonerspellsContainer} from "./models/dto/containers/summonerspells-container";
import {Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private is_setup_ready: boolean = false;
  private is_metadata_ready: boolean = false;

  public champions: ChampionsContainer;
  public items: ItemsContainer;
  public summonerspells: SummonerspellsContainer;

  constructor(private platformLocation: PlatformLocation, private router: Router, private static_api: StaticApiService) {}

  public handleSetupReady(e) {
    // Activate menu
    this.is_setup_ready = true;
    // If setup was first time instantiated, default route redirects any given path to /
    // ...so if it's NOT first time, then pathname != base href.
    // Initially router doesn't trigger the default route when CanActivateViaRouteGuard would let it
    // ...so we trigger it here manually after "isFirstTime" -check.
    // Else (if it's NOT first time) the Guard won't prevent router, and it'll route by itself.
    if (this.platformLocation.getBaseHrefFromDOM() === this.platformLocation.pathname) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    Observable.forkJoin([
      this.static_api.getChampions(),
      this.static_api.getItems(),
      this.static_api.getSummonerspells()
    ])
      .subscribe(static_api_responses => {
        if (Object.keys(static_api_responses).every(k => static_api_responses[k].type == ResType.SUCCESS)) {
          this.champions      = static_api_responses[0].data;
          this.items          = static_api_responses[1].data;
          this.summonerspells = static_api_responses[2].data;
          this.is_metadata_ready = true;
        }
      });
  }
}