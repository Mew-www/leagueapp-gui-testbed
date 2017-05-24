import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js';
import {GameRecordPersonalised} from "../../../../../models/game-record-personalised";

@Component({
  selector: 'player-game-details',
  templateUrl: './player-game-details.component.html',
  styleUrls: ['./player-game-details.component.scss']
})
export class PlayerGameDetailsComponent implements OnInit {

  @Input() details: GameRecordPersonalised;

  @ViewChild('allyDeathsChart') ally_deaths_chart_el: ElementRef;
  @ViewChild('enemyDeathsChart') enemy_deaths_chart_el: ElementRef;
  constructor() { }

  ngOnInit() {
    let sorted_allies = this.details.teams.ally.players.sort((p1,p2) => p2.stats.kda.deaths - p1.stats.kda.deaths);
    let lowest_ally_deathcount = sorted_allies[4].stats.kda.deaths || 1;
    let ally_deaths_allocated_chart = new Chart(this.ally_deaths_chart_el.nativeElement, {
      type: 'bar',
      data: {
        labels: sorted_allies.map(p=>p.summoner.current_name),
        datasets: [
          {
            type: 'bar',
            data: sorted_allies.map((p=>p.stats.kda.deaths))
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                console.log(value.toString() + " to " + (value/lowest_ally_deathcount).toString() + " to "
                  + (value/lowest_ally_deathcount).toString().split('.').map((str,idx)=>idx==0?str:str.slice(0,2)).join("."));
                return (value/lowest_ally_deathcount) < 1 && value !== 0 ? "" : (value/lowest_ally_deathcount).toString().split('.').map((str,idx)=>idx==0?str:str.slice(0,2)).join(".")+"x";
              }
            }
          }]
        }
      }
    });
    let sorted_enemies = this.details.teams.enemy.players.sort((p1,p2) => p2.stats.kda.deaths - p1.stats.kda.deaths);
    let lowest_enemy_deathcount = sorted_enemies[4].stats.kda.deaths || 1;
    let enemy_deaths_allocated_chart = new Chart(this.enemy_deaths_chart_el.nativeElement, {
      type: 'bar',
      data: {
        labels: sorted_enemies.map(p=>p.summoner.current_name),
        datasets: [
          {
            type: 'bar',
            data: sorted_enemies.map((p=>p.stats.kda.deaths))
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                console.log(value.toString() + " to " + (value/lowest_enemy_deathcount).toString() + " to "
                  + (value/lowest_enemy_deathcount).toString().split('.').map((str,idx)=>idx==0?str:str.slice(0,2)).join("."));
                return (value/lowest_enemy_deathcount) < 1 && value !== 0 ? "" : (value/lowest_enemy_deathcount).toString().split('.').map((str,idx)=>idx==0?str:str.slice(0,2)).join(".")+"x";
              }
            }
          }]
        }
      }
    });

  }

}
