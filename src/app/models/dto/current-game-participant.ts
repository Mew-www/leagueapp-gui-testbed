import {Champion} from "./champion";
import {SummonerIcon} from "./sub/summoner-icon";
import {ChampionsContainer} from "./containers/champions-container";
import {SummonerspellsContainer} from "./containers/summonerspells-container";

export class CurrentGameParticipant {

  public readonly team_id;
  public readonly summoner_id;
  public readonly summoner_name;
  public readonly summoner_icon: SummonerIcon;
  public readonly champion: Champion;
  public readonly summonerspell_1;
  public readonly summonerspell_2;
  public readonly masteries;
  public readonly runes;

  // https://developer.riotgames.com/api-methods/#spectator-v3/GET_getCurrentGameInfoBySummoner
  constructor(participant_json, champions: ChampionsContainer, summonerspells: SummonerspellsContainer) {
    this.team_id = participant_json.teamId;
    this.summoner_id = participant_json.summonerId;
    this.summoner_name = participant_json.summonerName;
    this.summoner_icon = new SummonerIcon(participant_json.profileIconId);
    this.champion = champions.getChampionById(participant_json.championId);
    this.summonerspell_1 = summonerspells.getSummonerspellById(participant_json.spell1Id);
    this.summonerspell_2 = summonerspells.getSummonerspellById(participant_json.spell2Id);
    this.masteries = participant_json.masteries;
    this.runes = participant_json.runes;
  }
}