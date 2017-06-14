import {GameTimeline} from "./dto/game-timeline";
import {ItemsContainer} from "./dto/containers/items-container";
import {TimelineEventType} from "../enums/timeline-event-type";
import {Item} from "./dto/item";

export class GameTimelinePersonalised extends GameTimeline {

  public readonly allies;
  public readonly enemies;

  constructor(timeline_json, players_by_participant_id_by_teams, items: ItemsContainer) {

    super(timeline_json);

    let allies_by_participant_id = players_by_participant_id_by_teams.allies;
    let enemies_by_participant_id = players_by_participant_id_by_teams.enemies;
    let listed_ally_participant_ids_as_str = Object.keys(allies_by_participant_id).map(id => id.toString());
    let listed_enemy_participant_ids_as_str = Object.keys(enemies_by_participant_id).map(id => id.toString());
    // Some events belong the NPCs, these are not mapped anywhere
    let listed_players_participant_ids_as_str = listed_ally_participant_ids_as_str.concat(listed_enemy_participant_ids_as_str).map(id => id.toString());
    let allies = listed_ally_participant_ids_as_str.map(p_id => allies_by_participant_id[p_id]);
    let enemies = listed_enemy_participant_ids_as_str.map(p_id => enemies_by_participant_id[p_id]);
    let all_events = timeline_json.frames.reduce((events, frame) => {
      events = events.concat(frame.events);
      return events;
    }, []);

    this.allies = allies.map(player => {
      return {
        player: player,
        // {type: TimelineEventType (BUY/SELL/DESTROY), item: Item, ms_passed: number}
        item_events: [],
        // {type: TimelineEventType (KILL/DEATH), other_player: Champion, assisting_players: [Champion, ...], position: {x: number, y: number}, ms_passed: number}
        player_kill_events: [],
        // {type: TimelineEventType (SKILL_LEVEL_UP), skill_slot: number, ms_passed: number}
        skill_up_events: []
      };
    });
    this.enemies = enemies.map(player => {
      return {
        player: player,
        // {type: TimelineEventType (BUY/SELL/DESTROY), item: Item, ms_passed: number}
        item_events: [],
        // {type: TimelineEventType (KILL/DEATH), other_player: Champion, assisting_players: [Champion, ...], position: {x: number, y: number}, ms_passed: number}
        player_kill_events: [],
        // {type: TimelineEventType (SKILL_LEVEL_UP), skill_slot: number, ms_passed: number}
        skill_up_events: []
      };
    });
    // We need this only for duration of parsing... after that participant IDs may be gone with the wind
    let team_irrespective_player_lookup = listed_players_participant_ids_as_str.reduce((lookup, participant_id_str) => {
      let is_ally = listed_ally_participant_ids_as_str.indexOf(participant_id_str) !== -1;
      let player = is_ally ? allies_by_participant_id[participant_id_str] : enemies_by_participant_id[participant_id_str];
      lookup[participant_id_str] = is_ally ?
        this.allies.find(ally => ally.player.summoner.id === player.summoner.id)
        : this.enemies.find(enemy => enemy.player.summoner.id === player.summoner.id);
      return lookup;
    }, {});

    // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatchTimeline
    // TYPES:
    //    CHAMPION_KILL,
    //    WARD_PLACED, WARD_KILL,
    //    BUILDING_KILL,
    //    ELITE_MONSTER_KILL,
    //    ITEM_PURCHASED, ITEM_SOLD, ITEM_DESTROYED, ITEM_UNDO, (parsed)
    //    SKILL_LEVEL_UP,
    //      ASCENDED_EVENT, CAPTURE_POINT, PORO_KING_SUMMON (skipped)

    all_events.forEach(event => {
      // If event belongs to an NPC, then early return (this does not filter NPC kills or player kills where it's respectively killerId or so)
      if (event.hasOwnProperty('participantId') && listed_players_participant_ids_as_str.indexOf(event.participantId.toString()) === -1) {
        return;
      }

      switch (event.type) {
        case 'SKILL_LEVEL_UP':
          team_irrespective_player_lookup[event.participantId.toString()].skill_up_events.push({
            type: TimelineEventType.SKILL_LEVEL_UP,
            skill_slot: event.skillSlot,
            ms_passed: event.timestamp
          });
          break;

        case 'CHAMPION_KILL':
          // Record as KILL (if not tower -> participant 0)
          if (event.killerId.toString() !== "0") {
            team_irrespective_player_lookup[event.killerId.toString()].player_kill_events.push({
              type: TimelineEventType.CHAMPION_KILL,
              other_player: team_irrespective_player_lookup[event.victimId.toString()].player,
              assisting_players: event.assistingParticipantIds.map(id => team_irrespective_player_lookup[id].player),
              position: event.position,
              ms_passed: event.timestamp
            });
          }
          // Record as DEATH
          team_irrespective_player_lookup[event.victimId.toString()].player_kill_events.push({
            type: TimelineEventType.CHAMPION_DEATH,
            other_player: event.killerId.toString() !== "0" ? team_irrespective_player_lookup[event.killerId.toString()].player : null,
            assisting_players: event.assistingParticipantIds.map(id => team_irrespective_player_lookup[id].player),
            position: event.position,
            ms_passed: event.timestamp
          });
          break;

        case 'ITEM_PURCHASED':
          team_irrespective_player_lookup[event.participantId.toString()].item_events.push({
            type: TimelineEventType.ITEM_PURCHASED,
            item: items.getItemById(event.itemId),
            ms_passed: event.timestamp
          });
          break;

        case 'ITEM_SOLD':
          team_irrespective_player_lookup[event.participantId.toString()].item_events.push({
            type: TimelineEventType.ITEM_SOLD,
            item: items.getItemById(event.itemId),
            ms_passed: event.timestamp
          });
          break;

        case 'ITEM_DESTROYED':
          team_irrespective_player_lookup[event.participantId.toString()].item_events.push({
            type: TimelineEventType.ITEM_DESTROYED,
            item: items.getItemById(event.itemId),
            ms_passed: event.timestamp
          });
          break;

        case 'ITEM_UNDO':
          let participant = team_irrespective_player_lookup[event.participantId.toString()];
          let index_of_last_purchase = participant.item_events.map(e => e.type).lastIndexOf(TimelineEventType.ITEM_PURCHASED);
          let index_of_last_selling = participant.item_events.map(e => e.type).lastIndexOf(TimelineEventType.ITEM_SOLD);
          let index_of_undone_event = index_of_last_purchase > index_of_last_selling ? index_of_last_purchase : index_of_last_selling;
          // The following WILL also remove any ITEM_DESTROYED caused by Manamune (3004, 3008) -> Muramana or Archangel's (3003, 3007) -> Seraph's
          //   Those events DO NOT trigger ITEM_PURCHASED or so.
          //   Odd enough, seems Muramana nor Archangel's are not displayed in timelines.
          //   Seems they are only indicated by ITEM_DESTROYED on their predecessor item.
          let removed_events = participant.item_events.splice(index_of_undone_event);
          let unrelated_events = removed_events.filter(event => {
            return event.type === TimelineEventType.ITEM_DESTROYED
                    && [3004, 3008, 3003, 3007].indexOf((<Item>event.item).id) !== -1;
          });
          // Re-add if any unrelated events
          participant.item_events = participant.item_events.concat(unrelated_events);
          break;

        default:
          break;
      }
    });
  }

}