import {Component, Input, OnInit} from '@angular/core';
import {PlayerApiService} from "../../services/player-api.service";
import {RatelimitedRequestsService} from "../../services/ratelimited-requests.service";
import {ResType} from "../../enums/api-response-type";
import {ExplorerApiService} from "../../services/explorer-api.service";
import {GameApiService} from "../../services/game-api.service";
import {GameType} from "../../enums/game-type";
import {GameReference} from "../../models/dto/game-reference";
import {Observable} from "rxjs/Observable";
import {ApiResponse} from "../../helpers/api-response";
import {GameRecord} from "../../models/dto/game-record";
import {GameTimeline} from "../../models/dto/game-timeline";
import {ChampionsContainer} from "../../models/dto/containers/champions-container";

@Component({
  selector: 'explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Input() champions: ChampionsContainer;

  private region_euw = "EUW";
  private days_to_past = 1;
  private seen_games = [];
  private seen_timelines = [];
  private known_players = [];
  private parsed_players = [];
  private failed_requests = [];
  // Curious
  private start_summoner_name = null;
  private number_of_games = 0;
  private parsed_names = [];

  constructor(private player_api: PlayerApiService,
              private game_api: GameApiService,
              private bufferedRequests: RatelimitedRequestsService,
              private explorer_api: ExplorerApiService) { }

  private promptNewSummonerThenLoadEUW() {
    let new_summ_name = window.prompt('Summoner name please');
    this.bufferedRequests.buffer(() => {
      return this.player_api.getSummonerByName(this.region_euw, new_summ_name);
    })
      .subscribe(res => {
        if (res.type === ResType.NOT_FOUND) {
          window.alert('That name wasn\'t found, try again.');
          this.promptNewSummonerThenLoadEUW();
        } else if (res.type !== ResType.SUCCESS) {
          window.alert('Something went wrong, while trying to find summoner by name');
        } else {
          let summoners_account_id = res.data.account_id;
          this.start_summoner_name = res.data.current_name;
          this.loadEUW(summoners_account_id);
        }
      });
  }

  private loadEUW(summoners_account_id) {
    // Toss the details "viewed this player" separately, not part of main loop anyway, just fun to see
    this.bufferedRequests.buffer(() => {
      return this.player_api.getSummonerById(this.region_euw, summoners_account_id);
    })
      .subscribe(res => {
        if (res.type === ResType.SUCCESS && res.data.current_name !== this.start_summoner_name) {
          this.parsed_names.push(res.data.current_name);
        }
      });

    this.bufferedRequests.buffer(() => {
      return this.player_api.getListOfRankedGamesJson(this.region_euw, summoners_account_id, GameType.SOLO_QUEUE, this.champions);
    })
      .subscribe(res => {
        if (res.type === ResType.ERROR) {
          window.alert('Something went wrong, while trying to get player\'s soloqueue history');
          return;
        }
        if (res.type === ResType.NOT_FOUND) {
          this.parsed_players.push(summoners_account_id);
          let known_non_parsed_players = this.known_players.filter(account_id => this.parsed_players.indexOf(account_id) === -1);
          if (known_non_parsed_players.length === 0) {
            window.alert('This one has no games to parse, and out of people to parse. Gimme new.');
            this.promptNewSummonerThenLoadEUW();
          }
          let next_target = known_non_parsed_players[0];
          this.loadEUW(next_target);
          return;
        }
        let meaningful_history = res.data
          .filter((gameref: GameReference) => gameref.game_start_time.getTime() > (new Date().getTime()-1000*60*60*24*this.days_to_past))
          .map((gameref: GameReference) => gameref.game_id);
        this.number_of_games = meaningful_history.length;
        let new_games = meaningful_history.filter(game_id => this.seen_games.indexOf(game_id) === -1);
        let new_timelines = meaningful_history.filter(game_id => this.seen_timelines.indexOf(game_id) === -1);

        if (new_games.length === 0 && new_timelines.length === 0) {
          this.parsed_players.push(summoners_account_id);
          let known_non_parsed_players = this.known_players.filter(account_id => this.parsed_players.indexOf(account_id) === -1);
          if (known_non_parsed_players.length === 0) {
            window.alert('This one has no games to parse, and out of people to parse. Gimme new.');
            this.promptNewSummonerThenLoadEUW();
          }
          let next_target = known_non_parsed_players[0];
          this.loadEUW(next_target);
        }

        this.loadGamesAndTimelinesFrom(new_games, new_timelines, summoners_account_id);
      });
  }

  private loadGamesAndTimelinesFrom(new_games, new_timelines, current_account_id) {
    let batch_of_games = new_games.splice(0,5); // REMEMBER! ALSO removes in-place those from new_games
    let batch_of_timelines = new_timelines.splice(0, 5); // REMEMBER! ALSO removes in-place those from new_timelines
    Observable.forkJoin(
      batch_of_games.map(game_id => {
        return this.bufferedRequests.buffer(() => {
          return this.game_api.getHistoricalGame(this.region_euw, game_id);
        })
      }).concat(
        batch_of_timelines.map(game_id => {
          return this.bufferedRequests.buffer(() => {
            return this.game_api.getHistoricalTimeline(this.region_euw, game_id);
          })
        })
      )
    )
      .subscribe(responses => {
        console.log("Finished requesting " + batch_of_games.join(","));
        console.log(responses);
        let game_responses = Array.from(responses).slice(0,batch_of_games.length);
        let timeline_responses = Array.from(responses).slice(batch_of_games.length);
        (<Array<ApiResponse<GameRecord, any, number>>>game_responses).forEach((game_res, index) => {
          if (game_res.type !== ResType.SUCCESS) {
            let failed_request = this.failed_requests.find(fr => fr.type === "Game" && fr.game_id === batch_of_games[index]);
            if (!failed_request) {
              failed_request = {
                game_id: batch_of_games[index],
                type: "Game",
                times_failed: 0,
                reasons: []
              };
              this.failed_requests.push(failed_request);
            }
            failed_request.times_failed++;
            failed_request.reasons.push(game_res.error);
            console.log(game_res.error);
            // Don't process this game response any further
            return;
          }
          let game_dataset = game_res.data.raw_origin;
          this.known_players = this.known_players.concat(game_dataset.participantIdentities.map(p => p.player.accountId))
            .filter((v, i, s) => s.indexOf(v) === i); // Filter to unique values only
          this.seen_games.push(game_dataset.gameId);
        });
        (<Array<ApiResponse<GameTimeline, any, number>>>timeline_responses).forEach((timeline_res, index) => {
          if (timeline_res.type !== ResType.SUCCESS) {
            let failed_request = this.failed_requests.find(fr => fr.type === "Timeline" && fr.game_id === batch_of_timelines[index]);
            if (!failed_request) {
              failed_request = {
                game_id: batch_of_timelines[index],
                type: "Timeline",
                times_failed: 0,
                reasons: []
              };
              this.failed_requests.push(failed_request);
            }
            failed_request.times_failed++;
            failed_request.reasons.push(timeline_res.error);
            console.log(timeline_res.error);
            // Don't process this timeline response any further
            return;
          }
          // We don't really need the timeline response content here, pick game_id from original batch in order of requests
          this.seen_timelines.push(batch_of_timelines[index]);
        });
        if (new_games.length > 0 || new_timelines.length > 0) {
          this.loadGamesAndTimelinesFrom(new_games, new_timelines, current_account_id);
        } else {
          this.parsed_players.push(current_account_id);
          let known_non_parsed_players = this.known_players.filter(account_id => this.parsed_players.indexOf(account_id) === -1);
          if (known_non_parsed_players.length === 0) {
            window.alert('Finished parsing this, and now out of people to parse. Gimme new.');
            this.promptNewSummonerThenLoadEUW();
          }
          let next_target = known_non_parsed_players[0];
          this.loadEUW(next_target);
        }
      });
  }

  ngOnInit() {

  }

}
