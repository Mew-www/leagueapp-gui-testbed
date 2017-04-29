import {GameRecord} from "./game-record";
import {Summoner} from "./summoner";
import {Champion} from "./champion";

export class GameRecordPersonalised extends GameRecord {

  public readonly match_start_epochtime;
  public readonly match_duration_seconds;
  public readonly league_version;
  public readonly league_season;
  public readonly teams;

  constructor(game_json, looked_up_summoner_id, champions_list: Array<Champion>) {
    super(game_json);

    // All of the following ASSUMES the JSON structure is like so

    function parse_teamdata(ally_team_id, get_ally_data: boolean) {
      return {
        stats: game_json.teams
          .filter(t => (get_ally_data ? t.teamId === ally_team_id : t.teamId !== ally_team_id))
          .map(team => {
            return {
              isWinningTeam: team.winner,
              gotFirstBlood: team.firstBlood,
              gotFirstTower: team.firstTower,
              gotRiftHerald: team.firstRiftHerald,
              timesDestroyedTower: team.towerKills,
              timesKilledDragon: team.dragonKills,           gotFirstDragon: team.firstDragon,
              timesKilledBaron: team.baronKills,             gotFirstBaron: team.firstBaron,
              timesDestroyedInhibitor: team.inhibitorKills,  gotFirstInhibitor: team.firstInhibitor,
              kda: game_json.participants
                .filter(p => (get_ally_data ? p.teamId === ally_team_id : p.teamId !== ally_team_id))
                .reduce((kda, p) => {
                  let pstats = p.stats;
                  kda['kills'] += pstats.kills;
                  kda['deaths'] += pstats.deaths;
                  kda['assists'] += pstats.assists;
                  return kda;
                }, {kills: 0, deaths: 0, assists: 0})
            }
          })[0],
        bans: game_json.teams
          .filter(t => (get_ally_data ? t.teamId === ally_team_id : t.teamId !== ally_team_id))
          [0]
          .bans
            .sort((a,b)=>a.pickTurn-b.pickTurn)
            .map(ban => {
              return {
                champion: champions_list.filter(c => c.id === ban.championId)[0],
                banTurn: ban.pickTurn
              };
            }),
        players: game_json.participants
          .filter(p => (get_ally_data ? p.teamId === ally_team_id : p.teamId !== ally_team_id))
          .map(p => {
            let pstats = p.stats;
            return {
              summoner: player_map[p.participantId],
              border: p.highestAchievedSeasonTier,
              champion: champions_list.filter(c => c.id === p.championId)[0],
              summoner_spell1: p.spell1Id, // TODO SummSpell class
              summoner_spell2: p.spell2Id,
              masterypage: p.masteries, // TODO MasteryPage class
              runepage: p.runes, // TODO RunePage class
              stats: {
                final_champion_level: pstats.champLevel,
                gold_earned: pstats.goldEarned,
                creeps: {
                  lane: pstats.minionsKilled, // TODO: confirm this isn't total CS, in which case reduce jungle cs
                  jungle: pstats.neutralMinionsKilled, // TODO: confirm this doesn't count summons
                  counterjungle: pstats.neutralMinionsKilledEnemyJungle,
                  allyjungle: pstats.neutralMinionsKilledTeamJungle
                },
                gold_spent: pstats.goldSpent,
                final_items: [
                  pstats.item0,
                  pstats.item1,
                  pstats.item2,
                  pstats.item3,
                  pstats.item4,
                  pstats.item5,
                  pstats.item6
                ],
                kda: {
                  kills: pstats.kills,
                  deaths: pstats.deaths,
                  assists: pstats.assists
                },
                killing_sprees: {
                  double_kills: pstats.doubleKills,
                  triple_kills: pstats.tripleKills,
                  quadra_kills: pstats.quadraKills,
                  penta_kills: pstats.pentaKills,
                  six_plus_wat_kills: pstats.unrealKills,
                  killing_sprees: pstats.killingSprees,
                  largest_killing_spree: pstats.largestKillingSpree
                },
                combat_totals: {
                  largest_critical_strike: pstats.largestCriticalStrike,
                  damage_dealt_vs_champions: {
                    physical: pstats.physicalDamageDealtToChampions,
                    magical: pstats.magicDamageDealtToChampions,
                    truetype: pstats.trueDamageDealtToChampions,
                    all: pstats.totalDamageDealtToChampions
                  },
                  damage_dealt_vs_npcs: {
                    physical: (pstats.physicalDamageDealt - pstats.physicalDamageDealtToChampions),
                    magical: (pstats.magicDamageDealt - pstats.magicDamageDealtToChampions),
                    truetype: (pstats.trueDamageDealt - pstats.trueDamageDealtToChampions),
                    all: (pstats.totalDamageDealt - pstats.totalDamageDealtToChampions)
                  },
                  damage_taken: {
                    physical: pstats.physicalDamageTaken,
                    magical: pstats.magicDamageTaken,
                    truetype: pstats.trueDamageTaken,
                    all: pstats.totalDamageTaken
                  },
                  total_heal: pstats.totalHeal,
                  total_units_healed: pstats.totalUnitsHealed, // TODO: figure difference between totalHeal
                  cc_applied_seconds: pstats.totalTimeCrowdControlDealt,
                },
                vision: {
                  normalwards_bought: pstats.sightWardsBoughtInGame,
                  pinkwards_bought: pstats.visionWardsBoughtInGame,
                  wards_killed: pstats.wardsKilled,
                  wards_placed: pstats.wardsPlaced,
                },
                objectives: {
                  gotFirstBlood: pstats.firstBloodKill,
                  gotFirstBloodAssist: pstats.firstBloodAssist,
                  gotFirstTower: pstats.firstTowerKill,
                  gotFirstTowerAssist: pstats.firstTowerAssist,
                  gotFirstInhibitor: pstats.firstInhibitorKill,
                  gotFirstInhibitorAssist: pstats.firstInhibitorAssist,
                  towers_killed: pstats.towerKills,
                  inhibitors_killed: pstats.inhibitorKills
                }
              }
            };
          })
      };
    }

    let self_participant_id = null;
    let player_map = game_json.participantIdentities.reduce((mapping, p) => {
      mapping[p.participantId] = new Summoner(p.player.summonerId, p.player.summonerName, p.player.profileIcon);
      if (p.player.summonerId === looked_up_summoner_id) {
        self_participant_id = p.participantId;
      }
      return mapping;
    }, {});
    let ally_team_id = game_json.participants.filter(p => p.participantId === self_participant_id)[0].teamId;

    this.match_start_epochtime = game_json.matchCreation;
    this.match_duration_seconds = game_json.matchDuration;
    this.league_version = game_json.matchVersion.split('.').slice(0,2).join('.');
    this.league_season = game_json.season;
    this.teams = {
      ally: parse_teamdata(ally_team_id, true),
      enemy: parse_teamdata(ally_team_id, false)
    };

  }
}