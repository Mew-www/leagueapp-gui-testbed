import {Component, Input, OnInit} from '@angular/core';
import {Summoner} from "../../../../models/dto/summoner";
import {GameType} from "../../../../enums/game-type";
import {ChampionsContainer} from "../../../../models/dto/containers/champions-container";
import {ItemsContainer} from "../../../../models/dto/containers/items-container";
import {SummonerspellsContainer} from "../../../../models/dto/containers/summonerspells-container";

@Component({
  selector: 'pre-game-teammates',
  templateUrl: './pre-game-teammates.component.html',
  styleUrls: ['./pre-game-teammates.component.scss']
})
export class PreGameTeammatesComponent implements OnInit {

  @Input() queue: GameType;
  @Input() teammates: Array<Summoner>;

  // Metadata
  @Input() champions: ChampionsContainer;
  @Input() items: ItemsContainer;
  @Input() summonerspells: SummonerspellsContainer;

  private display_icons: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
