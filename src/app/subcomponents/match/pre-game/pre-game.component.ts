import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Summoner} from "../../../models/dto/summoner";
import {GameType} from "../../../enums/game-type";
import {ChampionsContainer} from "../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "app/models/dto/containers/summonerspells-container";

@Component({
  selector: 'pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  @Output() gameStartedWithTeammate: EventEmitter<Summoner> = new EventEmitter();

  private queue_type: GameType = null;
  private teammates: Array<Summoner> = null;

  constructor() { }

  private isMetadataReady() {
    return this.champions && this.items && this.summonerspells;
  }

  private handleChosenQueueType(queue_type) {
    this.queue_type = queue_type;
  }

  private handleNewTeammates(teammates) {
    this.teammates = teammates;
  }

  ngOnInit() {
  }

}
