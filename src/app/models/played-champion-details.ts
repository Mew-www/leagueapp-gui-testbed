import {Champion} from "./dto/champion";
import {GameReference} from "./dto/game-reference";

export class PlayedChampionDetails {

  public readonly champion: Champion; //{champion_name, most_recent_time, oldest_time, gamereferences}
  public readonly most_recent_time_played: Date = null;
  public readonly oldest_time_played: Date = null;
  public readonly gamereferences: Array<GameReference>;

  constructor(champion: Champion, gamereferences: Array<GameReference>) {
    this.champion = champion;
    let gamereferences_sorted_by_time = gamereferences
      .sort((a: GameReference, b: GameReference) => {
        return b.game_start_time.getTime() - a.game_start_time.getTime(); // Starting from now to oldest one
      });
    if (gamereferences_sorted_by_time.length > 0) {
      this.most_recent_time_played = gamereferences[0].game_start_time;
      this.oldest_time_played = gamereferences[gamereferences.length-1].game_start_time;
    }
    this.gamereferences = gamereferences_sorted_by_time;
  }
}