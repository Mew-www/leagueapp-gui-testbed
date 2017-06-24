import {GameRecord} from "./dto/game-record";
import {Summoner} from "./dto/summoner";
import {Season} from "../enums/rito/season";
import {ChampionsContainer} from "./dto/containers/champions-container";
import {ItemsContainer} from "./dto/containers/items-container";
import {SummonerspellsContainer} from "./dto/containers/summonerspells-container";
import {GameTimeline} from "./dto/game-timeline";

export class GameRecordPersonalised extends GameRecord {

  public readonly game_id: Number;
  public readonly match_start_time: Date;
  public readonly match_duration_seconds: Number;
  public readonly league_version: string;
  public readonly league_season: Season;
  public readonly teams;
  public timeline: GameTimeline = null;

  constructor(game_json, looked_up_summoner: Summoner,
              champions: ChampionsContainer, items: ItemsContainer, summonerspells: SummonerspellsContainer) {

    super(game_json);

    // https://developer.riotgames.com/api-methods/#match-v3/GET_getMatch
    function parse_teamdata(ally_team_id, get_ally_data: boolean, player_map) {
      return {
        stats: game_json.teams
          .filter(t => (get_ally_data ? t.teamId === ally_team_id : t.teamId !== ally_team_id))
          .map(team => {
            return {
              isWinningTeam: game_json.gameDuration > 271 ? team.win === "Win" : null, // null means remake
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
                champion: champions.getChampionById(ban.championId),
                banTurn: ban.pickTurn
              };
            }),
        players: game_json.participants
          .filter(p => (get_ally_data ? p.teamId === ally_team_id : p.teamId !== ally_team_id))
          .map(p => {
            let pstats = p.stats;
            return {
              summoner: player_map[p.participantId],
              is_the_target: player_map[p.participantId].id === looked_up_summoner.id,
              border: p.highestAchievedSeasonTier,
              champion: champions.getChampionById(p.championId),
              summoner_spell1: summonerspells.getSummonerspellById(p.spell1Id),
              summoner_spell2: summonerspells.getSummonerspellById(p.spell2Id),
              masterypage: p.masteries, // TODO MasteryPage class
              runepage: p.runes, // TODO RunePage class
              stats: {
                final_champion_level: pstats.champLevel,
                gold_earned: pstats.goldEarned,
                creeps: {
                  lane: pstats.totalMinionsKilled,
                  jungle: pstats.neutralMinionsKilled,
                  counterjungle: pstats.neutralMinionsKilledEnemyJungle,
                  allyjungle: pstats.neutralMinionsKilledTeamJungle
                },
                timeline: {
                  cs_at_ten: p.timeline.hasOwnProperty('creepsPerMinDeltas') && p.timeline.creepsPerMinDeltas.hasOwnProperty('0-10') ?
                    Math.round(p.timeline.creepsPerMinDeltas['0-10']*10)
                    : null
                },
                gold_spent: pstats.goldSpent,
                final_items: [
                  pstats.item0 ? items.getItemById(pstats.item0) : null,
                  pstats.item1 ? items.getItemById(pstats.item1) : null,
                  pstats.item2 ? items.getItemById(pstats.item2) : null,
                  pstats.item3 ? items.getItemById(pstats.item3) : null,
                  pstats.item4 ? items.getItemById(pstats.item4) : null,
                  pstats.item5 ? items.getItemById(pstats.item5) : null,
                  pstats.item6 ? items.getItemById(pstats.item6) : null
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
                  total_units_healed: pstats.totalUnitsHealed, // nr of targets
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
      if (p.player.summonerId === looked_up_summoner.id) {
        self_participant_id = p.participantId;
        mapping[p.participantId] = looked_up_summoner;
      } else {
        mapping[p.participantId] = new Summoner(looked_up_summoner.region, p.player.summonerId, p.player.accountId, p.player.summonerName, p.player.profileIcon);
      }
      return mapping;
    }, {});
    let ally_team_id = game_json.participants.filter(p => p.participantId === self_participant_id)[0].teamId;

    this.game_id = game_json.gameId;
    this.match_start_time = new Date(game_json.gameCreation);
    this.match_duration_seconds = game_json.gameDuration;
    this.league_version = game_json.gameVersion.split('.').slice(0,2).join('.');
    this.league_season = game_json.seasonId;
    this.teams = {
      ally: parse_teamdata(ally_team_id, true, player_map),
      enemy: parse_teamdata(ally_team_id, false, player_map)
    };

  }
}