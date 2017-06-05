import {GameReference} from "../models/dto/game-reference";
import {ChampionsContainer} from "../models/dto/containers/champions-container";

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

  /*
    Items (Array<GameTimeline>) analytics
   */



}