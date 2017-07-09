import { Injectable } from '@angular/core';
import {StaticApiService} from "./static-api.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {ApiResponse} from "../helpers/api-response";
import {ResType} from "../enums/api-response-type";
import {ChampionsContainer} from "../models/dto/containers/champions-container";
import {ItemsContainer} from "../models/dto/containers/items-container";
import {SummonerspellsContainer} from "../models/dto/containers/summonerspells-container";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

/**
 * Usage (on component):
 *
 * ngOnInit() {
 *   // Ensure metadata is (being) loaded
 *   this.metadata_service.load();
 *   // Bind to it's readiness
 *   let sub = this.metadata_service.requests_finished$
 *     .subscribe(finished => {
 *       if (finished && this.metadata_service.is_ready) {
 *         // Do something with the metadata
 *         // Un-subscribe (sub.unsubscribe()) if you don't wish to update component on each metadata (re)load
 *         // Changes are not guaranteed, as a mere load() triggers the request_finished$ -event
 *         // ..so check whatever you expect was changed, on a per-component basis.
 *       }
 *     });
 * }
 */
@Injectable()
export class GameMetadataService {

  private ongoing_request: Subscription = null;
  private _requests_finished: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _champions: ChampionsContainer = null;
  private _items: ItemsContainer = null;
  private _summonerspells: SummonerspellsContainer = null;
  private _is_ready: boolean = false;

  public readonly requests_finished$: Observable<boolean> = this._requests_finished.asObservable();
  get champions(): ChampionsContainer {
    return this._champions;
  }
  get items(): ItemsContainer {
    return this._items;
  }
  get summonerspells(): SummonerspellsContainer {
    return this._summonerspells;
  }
  get is_ready(): boolean {
    return this._is_ready;
  }

  constructor(private static_api: StaticApiService) { }

  /**
   * Ensures initial load
   * Does NOT reset in-app cache
   */
  public load() {

    if (this.ongoing_request && !this.ongoing_request.closed) {
      // Already mid-loading, NO-OP
      return;
    }

    this._requests_finished.next(false);
    this.ongoing_request = Observable.forkJoin([
      this.static_api.getChampions(),
      this.static_api.getItems(),
      this.static_api.getSummonerspells()
    ])
      .subscribe((static_api_responses: Array<ApiResponse<any, string, number>>) => {
        if (static_api_responses.every(api_res => api_res.type === ResType.SUCCESS)) {
          this._champions      = static_api_responses[0].data;
          this._items          = static_api_responses[1].data;
          this._summonerspells = static_api_responses[2].data;
          this._is_ready = true;
        }
        this._requests_finished.next(true);
      })

  }

  /**
   * Resets in-app cache and forces reload
   * NOTE: Any metadata loaded into components has be refreshed on a per-component basis.
   * HOW-TO ABOVE: Bind them to this.request_finished$ -event and this.is_ready -flag.
   * IF RELOAD FAILS, there is currently no special handling for that scenario. It will fallback to existing metadata.
   * IF INITIAL LOAD failed you can catch that event by ´if (request_finished && !metadata.is_ready)´, and try (re)load.
   *
   * <rant>
   * I implemented it (error handling) once and it felt stupidly complicated for something not-really-necessary.
   * tl;dr: If someone wants to ENSURE the most recent metadata is loaded, he/she is expected to reload the entire app.
   * I wanna keep the BehaviourSubject as <boolean>. Tried with <MetadataState> enum etc~ but boolean is more pretty.
   * That's final.
   * </rant>
   *
   */
  public reload() {

    if (this.ongoing_request && !this.ongoing_request.closed) {
      // Already either mid-initial-loading or mid-reloading, NO-OP
      return;
    }

    // Reset in-app caches
    this.static_api.reloadChampions();
    this.static_api.reloadItemMap();
    this.static_api.reloadSummonerspellMap();

    this._requests_finished.next(false);
    this.ongoing_request = Observable.forkJoin([
      this.static_api.getChampions(),
      this.static_api.getItems(),
      this.static_api.getSummonerspells()
    ])
      .subscribe((static_api_responses: Array<ApiResponse<any, string, number>>) => {
        if (static_api_responses.every(api_res => api_res.type === ResType.SUCCESS)) {
          this._champions      = static_api_responses[0].data;
          this._items          = static_api_responses[1].data;
          this._summonerspells = static_api_responses[2].data;
          this._is_ready = true;
        }
        this._requests_finished.next(true);
      })
  }

}
