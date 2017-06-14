import {GameReference} from "../models/dto/game-reference";
import {ChampionsContainer} from "../models/dto/containers/champions-container";
import {GameRecordPersonalised} from "../models/game-record-personalised";
import {GameTimelinePersonalised} from "../models/game-timeline-personalised";
import {TimelineEventType} from "../enums/timeline-event-type";

export class Analytics {

  /*
    Game History (Array<GameReference>) analytics
     - parsePreferredLanes(gamehistory) -> 2 most found lanes
     - parsePlayedChampions(gamehistory, champions_metadata) -> gamehistory+stats, per champion played
     - addPlayedChampionLanesCalculations(played_champion) -> calculate on which lanes was a champion played
   */

  private static relevant_nr_of_games = 15;
  private static filter_lane_stat_tolerance = 0.5; // Split >66% <33%; 2 to 1+; E.g. yes 5 to 3, but not 5 to 2

  //  Returns (maximum two) player's most-played lanes, in order of (and including) their played percentages of total games
  public static parsePreferredLanes(gamehistory) {
    return gamehistory.reduce((seen_lanes, gameref: GameReference) => {
      let seen_lane = seen_lanes.find(s => s.lane_name === gameref.presumed_lane);
      if (!seen_lane) {
        seen_lane = {
          lane_name: gameref.presumed_lane,
          nr_of_games: 0
        };
        seen_lanes.push(seen_lane);
      }
      seen_lane.nr_of_games++;
      return seen_lanes;
    }, [])
      .sort((a,b) => b.nr_of_games - a.nr_of_games)
      .slice(0,2)
      .map(preferred_lane => {
        preferred_lane['percentage'] = Math.round(preferred_lane.nr_of_games / gamehistory.length * 100);
        return preferred_lane;
      });
  }

  // Returns player's played champions with their most-played lanes
  public static parsePlayedChampions(gamehistory, champions: ChampionsContainer) {
    return gamehistory.reduce((seen_champions, gameref: GameReference) => {
      let seen_champion = seen_champions.find(s => s.champion.id === gameref.chosen_champion.id);
      let lane = gameref.presumed_lane;
      if (!seen_champion) {
        seen_champion = {
          champion: champions.getChampionById(gameref.chosen_champion.id),
          nr_of_games: 0,
          lanes: {},
          gamereferences: []
        };
        seen_champions.push(seen_champion);
      }

      if (Object.keys(seen_champion.lanes).indexOf(lane) === -1) {
        seen_champion.lanes[lane] = 0;
      }
      seen_champion.gamereferences.push(gameref);
      seen_champion.nr_of_games++;
      seen_champion.lanes[lane]++;
      return seen_champions;
    }, [])
      .map(played_champion => {
        if (played_champion.gamereferences.length > 0) {
          played_champion['last_time_played'] = played_champion.gamereferences
            .sort((a: GameReference, b: GameReference) => {
            return b.game_start_time.getTime() - a.game_start_time.getTime(); // Starting from now to oldest one
          })[0].game_start_time;
        } else {
          played_champion['last_time_played'] = null;
        }
        return played_champion;
      });
  }

  // Lane must be either 1st, or have > 15 games, or be > 0.5 ratio to 1st most-played lane
  public static addPlayedChampionLanesCalculations(most_played_champion) {
    let first_sorted_lane = null;
    most_played_champion.lanes = Object.keys(most_played_champion.lanes).map(lane => {
      return {
        lane_name: lane,
        times_played: most_played_champion.lanes[lane],
        times_played_percent: Math.round(most_played_champion.lanes[lane] / most_played_champion.nr_of_games * 100)
      };
    })
      .sort((a,b) => b.times_played_percent - a.times_played_percent)
      .map((lane, i) => {
        if (i === 0) {
          // Keep most-played lane as is
          first_sorted_lane = lane;
          return lane;
        }
        if (lane.times_played < Analytics.relevant_nr_of_games
          && lane.times_played_percent < (first_sorted_lane.times_played_percent * Analytics.filter_lane_stat_tolerance))
        {
          lane.times_played_percent = 0;
        }
        // next
        return lane;
      })
      .filter(lane => lane.times_played_percent !== 0);
    return most_played_champion;
  }

  // Returns player's winrate by each day (in {D-M-YYYY: {wins: N, losses: M}, ...} -format)
  public static parseWinrateByDate(game_records) {
    let winrate_by_day = {};
    game_records.forEach((record: GameRecordPersonalised) => {
      let date = new Date(record.match_start_time);
      let date_string = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      if (!winrate_by_day.hasOwnProperty(date_string)) {
        winrate_by_day[date_string] = { wins: 0, losses: 0 };
      }
      if (record.teams.ally.stats.isWinningTeam) {
        winrate_by_day[date_string].wins++;
      } else {
        winrate_by_day[date_string].losses++;
      }
    });
    return winrate_by_day;
  }

  // Returns player's firstbloods vs. number of games
  public static parseFirstbloodRate(game_records) {
    let firstbloods = {
      'inflicted_on': [],
      'assisted_on': [],
      'gave_to': []
    };
    game_records.forEach((record: GameRecordPersonalised) => {
      let player = record.teams.ally.players.find(p => p.is_the_target);

      if (player.stats.objectives.gotFirstBlood) {
        let player_kill_event = (<GameTimelinePersonalised>record.timeline).allies.find(p => p.player.is_the_target)
          .player_kill_events.find(e => e.type == TimelineEventType.CHAMPION_KILL);
        firstbloods.inflicted_on.push({
          other_player: player_kill_event.other_player,
          position: player_kill_event.position,
          assisting_players: player_kill_event.assisting_players,
          self: player,
          at_game_time: player_kill_event.ms_passed
        });

      } else if (player.stats.objectives.gotFirstBloodAssist) {
        let scoring_player_record = (<GameTimelinePersonalised>record.timeline).allies.find(p => p.player.stats.objectives.gotFirstBlood);
        let scoring_player = scoring_player_record.player;
        let player_kill_event = scoring_player_record.player_kill_events.find(e => e.type == TimelineEventType.CHAMPION_KILL);
        firstbloods.assisted_on.push({
          other_player: player_kill_event.other_player,
          position: player_kill_event.position,
          scoring_player: scoring_player,
          additional_assisting_players: player_kill_event.assisting_players.filter(p => p.player.summoner_id !== player.summoner_id),
          self: player,
          at_game_time: player_kill_event.ms_passed
        });
      } else if (record.teams.enemy.stats.gotFirstBlood) {
        let other_player_record = (<GameTimelinePersonalised>record.timeline).enemies.find(p => p.player.stats.objectives.gotFirstBlood);
        let other_player = other_player_record.player;
        let player_kill_event = other_player_record.player_kill_events.find(e => e.type == TimelineEventType.CHAMPION_KILL);
        if (player_kill_event.other_player.summoner_id === player.summoner_id) {
          firstbloods.gave_to.push({
            other_player: other_player,
            position: player_kill_event.position,
            assisting_players: player_kill_event.assisting_players,
            self: player,
            at_game_time: player_kill_event.ms_passed
          });
        }
      }
    });
    return firstbloods;
  }

  /*
    Items (Array<GameTimelinePersonalised>) analytics
   */

  public static parseStartingAndFinishedItems(item_events, other_meaningful_item_ids) {
    // Other meaningful items to rush for, such as Sightstone, Jungle item upgrade, t1 boots
    function isFinishedItem(item) {
      return item.into.length === 0 || other_meaningful_item_ids.indexOf(item) !== -1;
    }
    function isConsumable(item) {
      return item.id === 2003 // Health potion
          || item.id === 2010 // Health potion (upgraded to Biscuit)
          /* Consider Corrupting Potion as finished item with active (as it has re-uses after back) */
          || item.id === 2055 // Control ward
          || item.id === 2011 // Elixir Of Skill (Ancient Coin quest)
          || item.id === 3513 // Eye of the Herald (trinket dropped by Rift Herald)
          || item.id === 3340 // Warding Totem
          || item.id === 3341 // Sweeping Lens Trinket
          || item.id === 3364 // Oracle Alteration
          || item.id === 3363 // Farsight Alteration
          || item.id === 2140 // Elixir of Wrath
          || item.id === 2139 // Elixir of Sorcery
          || item.id === 2138 // Elixir of Iron
          ;
    }
    let starting_items = [];
    let finished_items = [];

    // Parse starting items
    for (let i=0, total_cost = 0; i<item_events.length; i++) {
      let item = item_events[i].item;
      let cost = item.gold.total;
      if (item.gold.base !== cost) {
        let existing_preitems = item.from.filter(preq => starting_items.find(existing => existing.id === preq.id));
        cost = cost - existing_preitems.reduce((accum, existing) => accum+existing.gold.total, 0);
      }
      if (total_cost+cost > 500) {
        break; // done here
      }
      // else
      starting_items.push(item);
      total_cost += cost;
    }

    // Leave only most recent trinket in starting items (in case user bought-sold-bought-sold-bought-sold multiple...)
    let starting_trinket_ids = starting_items.map(item => item.id).filter(id => id === 3340 || id === 3341);
    starting_trinket_ids.forEach((trinket_id, i) => {
      let index = starting_items.map(item => item.id).indexOf(trinket_id);
      if (i != starting_trinket_ids.length-1) {
        starting_items.splice(index, 1);
      }
    });

    // Remove starting items from remaining
    item_events.splice(0, starting_items.length);

    // Parse finished items
    item_events.sort((a,b) => a.ms_passed - b.ms_passed)
      .forEach(item_event => {
        if (isFinishedItem(item_event.item) && !isConsumable(item_event.item)) {
          finished_items.push(item_event.item);
        }
      });
    return {
      starting: starting_items,
      finished: finished_items
    };
  }

  public static parseStartingAndFinishedItemsHabit(item_events_arrays, other_meaningful_item_ids) {
    // [[first_items{item, times_seen}], [second_items{..}], etc.]
    let starting_items_habit = [];
    let finished_items_habit = [];
    item_events_arrays.forEach(item_events => {
      let parsed_items = this.parseStartingAndFinishedItems(item_events, other_meaningful_item_ids);

      // Calculate finished items' occurrence count
      parsed_items['finished'].forEach((finished_item, i) => {
        if (finished_items_habit.length < i+1) {
          finished_items_habit.push([]);
        }
        let seen_record = finished_items_habit[i].find(record => record.item.id === finished_item.id);
        if (!seen_record) {
          seen_record = {
            item: finished_item,
            count: 0
          };
          finished_items_habit[i].push(seen_record);
        }
        seen_record.count++;
      });

      // Calculate starting items' occurrence count
      let seen_record = starting_items_habit.find(record => JSON.stringify(record.items.map(i => i.id).sort()) === JSON.stringify(parsed_items['starting'].map(i => i.id).sort()));
      if (!seen_record) {
        seen_record = {
          items: parsed_items['starting'],
          count: 0
        };
        starting_items_habit.push(seen_record);
      }
      seen_record.count++;
    });

    // Add occurrence %
    finished_items_habit.forEach(nth_finished_items => {
      let total_nth_count = nth_finished_items.reduce((total, record) => {
        total = total + record.count;
        return total;
      }, 0);
      nth_finished_items.map(nth_finished_item => {
        nth_finished_item['percentage'] = Math.round(nth_finished_item.count / total_nth_count * 100);
        return nth_finished_item;
      });
    });
    let total_starting_count = starting_items_habit.reduce((total, record) => {
      total = total + record.count;
      return total;
    }, 0);
    starting_items_habit.map(starting_items => {
      starting_items['percentage'] = Math.round(starting_items.count / total_starting_count * 100);
      return starting_items;
    });

    let most_present_items = finished_items_habit.reduce((all_items, nth_finished_items) => {
      all_items = all_items.concat(nth_finished_items.map(record => record.item));
      return all_items;
    },[])
      .filter((v, i, s) => {
        // Filter away non-unique items (duplicates and so)
        let items_as_ids = s.map(item => item.id);
        return items_as_ids.indexOf(v.id) === i;
      })
      .map(this_item => {
        let earliest_finish = 0;
        for (let i=0; i<finished_items_habit.length; i++) {
          if (finished_items_habit[i].find(record => record.item.id === this_item.id)) {
            earliest_finish = i;
            break;
          }
        }
        let latest_finish = 0;
        for (let i=0; i<finished_items_habit.length; i++) {
          if (finished_items_habit[i].find(record => record.item.id === this_item.id)) {
            latest_finish = i;
          }
        }
        let games_with_possible_finish = item_events_arrays
          .map(item_events => this.parseStartingAndFinishedItems(item_events, other_meaningful_item_ids)['finished'])
          .filter(game_finished_items => game_finished_items.length >= earliest_finish)
          .map(game_finished_items => game_finished_items.slice(0,6));
        let present_percentage = Math.round(games_with_possible_finish.filter(game_finished_items => {
          return game_finished_items.find(finished_item => finished_item.id === this_item.id);
        }).length / games_with_possible_finish.length * 100);
        return {
          item: this_item,
          percentage: present_percentage,
          earliest_finish: earliest_finish,
          latest_finish: latest_finish
        };
      })
      .filter(record => record.percentage > 50)
      .sort((a,b) => b.percentage - a.percentage)
      .slice(0,6)
      .sort((a,b) => a.earliest_finish - b.earliest_finish);

    return {
      starting: starting_items_habit,
      finished: finished_items_habit,
      mostly: most_present_items
    };
  }

}