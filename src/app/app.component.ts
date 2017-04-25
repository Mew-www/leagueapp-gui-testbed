import { Component } from '@angular/core';
import {StaticApiService} from "./services/static-api.service";
import {ResType} from "./enums/api-response-type";
import {Champion} from "./models/champion";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public items;
  public champions: Array<Champion>;

  constructor(private static_api: StaticApiService) {}

  ngOnInit() {

    this.static_api.getItemMap()
      .subscribe(api_res => {
        if (api_res.type == ResType.SUCCESS) {
          this.items = api_res.data;
        }
      });

    this.static_api.getChampions()
      .subscribe(api_res => {
        if (api_res.type == ResType.SUCCESS) {
          this.champions = api_res.data;
        }
      });
  }
}