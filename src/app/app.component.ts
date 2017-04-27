import { Component } from '@angular/core';
import {StaticApiService} from "./services/static-api.service";
import {ResType} from "./enums/api-response-type";
import {Champion} from "./models/champion";
import {PlayerApiService} from "./services/player-api.service";
import {Summoner} from "./models/summoner";
import {GameType} from "./enums/game-type";
import {GameApiService} from "./services/game-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public items;
  public champions: Array<Champion>;

  public selected_summoner: Summoner = null;
  public total_history = null;
  public selected_history = null;
  public error_text = null;

  constructor(
    private static_api: StaticApiService,
    private player_api: PlayerApiService,
    private game_api: GameApiService
  ) {}

  public selectSummoner(name) {
    this.error_text = null;
    this.player_api.getSummonerByName("EUW", name)
      .subscribe(api_res => {
        if (api_res.type == ResType.NOT_FOUND) {
          this.error_text = "Summoner with that name wasn't found.";
        }
        if (api_res.type == ResType.SUCCESS) {
          this.selected_summoner = api_res.data;
        }
      });
  }
  public updateSummoner() {
    this.player_api.getSummonerById("EUW", this.selected_summoner.id)
      .subscribe(api_res => {
        if (api_res.type == ResType.SUCCESS) {
          this.selected_summoner = api_res.data;
        }
      })
  }
  public fetchGameHistory() {
    this.total_history = null;
    this.selected_history = null;
    this.player_api.getListOfRecentGames("EUW", this.selected_summoner.id, GameType.SOLO_AND_FLEXQUEUE)
      .subscribe(api_res => {
        if (api_res.type == ResType.SUCCESS) {
          this.total_history = api_res.data['total_existing_records'];
          this.selected_history = api_res.data['records'];
        }
      })
  }
  public fetchGameDetails(game_id) {
    this.game_api.getHistoricalGame("EUW", game_id)
      .subscribe(api_res => {
        if (api_res.type == ResType.SUCCESS) {
          let game_record = api_res.data;
          this.selected_history.forEach(dataset => {
            if (dataset["match_id"] === game_id) {
              dataset["details"] = game_record.raw_origin['teams'].map(t => t['bans']);
              dataset["players"] = game_record.raw_origin['participantIdentities'];
            }
          });
        }
      });
  }

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