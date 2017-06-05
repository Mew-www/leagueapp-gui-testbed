import {GameTimeline} from "./dto/game-timeline";
import {ItemsContainer} from "./dto/containers/items-container";

export class GameTimelinePersonalised extends GameTimeline {

  // TODO
  private readonly tmp_players_by_teams;

  constructor(timeline_json, players_by_participant_id_by_teams, items: ItemsContainer) {

    super(timeline_json);

    // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatchTimeline
    function parseTimeline() {
      // TODO
    }

    // TODO
    this.tmp_players_by_teams = players_by_participant_id_by_teams;
  }

}