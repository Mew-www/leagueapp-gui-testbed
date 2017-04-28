import {GameRecord} from "./game-record";
import {Summoner} from "./summoner";
import {Champion} from "./champion";

export class GameRecordPersonalised extends GameRecord {

  private _match_start_epochtime;
  private _match_duration_seconds;
  private _league_version;
  private _league_season;
  private _teams;
  public get match_start_epochtime() { return this._match_start_epochtime; }
  public get match_duration_seconds() { return this._match_duration_seconds; }
  public get league_version() { return this._league_version; }
  public get league_season() { return this._league_season; }
  public get teams() { return this._teams; }

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
            return {
              summoner: player_map[p.participantId],
              border: p.highestAchievedSeasonTier,
              champion: champions_list.filter(c => c.id === p.championId)[0],
              summoner_spell1: p.spell1Id, // TODO SummSpell class
              summoner_spell2: p.spell2Id,
              masterypage: p.masteries, // TODO MasteryPage class
              runepage: p.runes, // TODO RunePage class
              stats: {
                final_champion_level: p.stats.champLevel,
                gold_earned: p.stats.goldEarned,
                creeps: {
                  lane: p.stats.minionsKilled, // TODO: confirm this isn't total CS, in which case reduce jungle cs
                  jungle: p.stats.neutralMinionsKilled, // TODO: confirm this doesn't count summons
                  counterjungle: p.stats.neutralMinionsKilledEnemyJungle,
                  allyjungle: p.stats.neutralMinionsKilledTeamJungle
                },
                gold_spent: p.stats.goldSpent,
                final_items: [
                  p.stats.item0,
                  p.stats.item1,
                  p.stats.item2,
                  p.stats.item3,
                  p.stats.item4,
                  p.stats.item5,
                  p.stats.item6
                ],
                kda: {
                  kills: p.stats.kills,
                  deaths: p.stats.deaths,
                  assists: p.stats.assists
                },
                killing_sprees: {
                  double_kills: p.stats.doubleKills,
                  triple_kills: p.stats.tripleKills,
                  quadra_kills: p.stats.quadraKills,
                  penta_kills: p.stats.pentaKills,
                  six_plus_wat_kills: p.stats.unrealKills,
                  killing_sprees: p.stats.killingSprees,
                  largest_killing_spree: p.stats.largestKillingSpree
                },
                combat_totals: {
                  largest_critical_strike: p.stats.largestCriticalStrike,
                  damage_dealt_vs_champions: {
                    physical: p.stats.physicalDamageDealtToChampions,
                    magical: p.stats.magicDamageDealtToChampions,
                    truetype: p.stats.trueDamageDealtToChampions,
                    all: p.stats.totalDamageDealtToChampions
                  },
                  damage_dealt_vs_npcs: {
                    physical: (p.stats.physicalDamageDealt - p.stats.physicalDamageDealtToChampions),
                    magical: (p.stats.magicDamageDealt - p.stats.magicDamageDealtToChampions),
                    truetype: (p.stats.trueDamageDealt - p.stats.trueDamageDealtToChampions),
                    all: (p.stats.totalDamageDealt - p.stats.totalDamageDealtToChampions)
                  },
                  damage_taken: {
                    physical: p.stats.physicalDamageTaken,
                    magical: p.stats.magicDamageTaken,
                    truetype: p.stats.trueDamageTaken,
                    all: p.stats.totalDamageTaken
                  },
                  total_heal: p.stats.totalHeal,
                  total_units_healed: p.stats.totalUnitsHealed, // TODO: figure difference between totalHeal
                  cc_applied_seconds: p.stats.totalTimeCrowdControlDealt,
                },
                vision: {
                  normalwards_bought: p.stats.sightWardsBoughtInGame,
                  pinkwards_bought: p.stats.visionWardsBoughtInGame,
                  wards_killed: p.stats.wardsKilled,
                  wards_placed: p.stats.wardsPlaced,
                },
                objectives: {
                  gotFirstBlood: p.stats.firstBloodKill,
                  gotFirstBloodAssist: p.stats.firstBloodAssist,
                  gotFirstTower: p.stats.firstTowerKill,
                  gotFirstTowerAssist: p.stats.firstTowerAssist,
                  gotFirstInhibitor: p.stats.firstInhibitorKill,
                  gotFirstInhibitorAssist: p.stats.firstInhibitorAssist,
                  towers_killed: p.stats.towerKills,
                  inhibitors_killed: p.stats.inhibitorKills
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

    this._match_start_epochtime = game_json.matchCreation;
    this._match_duration_seconds = game_json.matchDuration;
    this._league_version = game_json.matchVersion.split('.').slice(0,2).join('.');
    this._league_season = game_json.season;
    this._teams = {
      ally: parse_teamdata(ally_team_id, true),
      enemy: parse_teamdata(ally_team_id, false)
    };

  }
}