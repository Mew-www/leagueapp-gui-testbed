import { Component } from '@angular/core';
import {StaticApiService} from "./services/static-api.service";
import {ResType} from "./enums/api-response-type";
import {Champion} from "./models/dto/champion";
import {Observable} from "rxjs/Observable";
import {ChampionsContainer} from "./models/dto/containers/champions-container";
import {ItemsContainer} from "./models/dto/containers/items-container";
import {SummonerspellsContainer} from "./models/dto/containers/summonerspells-container";

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

  constructor(private static_api: StaticApiService) {}

  public handleSetupReady(e) {
    this.is_setup_ready = true;
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