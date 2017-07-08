import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'winrate-graph',
  templateUrl: './winrate-graph.component.html',
  styleUrls: ['./winrate-graph.component.scss']
})
export class WinrateGraphComponent implements OnInit, OnChanges {

  @ViewChild('winrate_chart_canvas') winrate_chart_canvas: ElementRef;
  @Input() stats_by_date = null;
  private initialized = false;

  constructor() { }

  private updateGraph() {

    let config = {
      type: 'bar',
      data: {
        labels: Object.keys(this.stats_by_date).map(datestring => moment(datestring,'DD-MM-YYYY')),
        datasets: [
          {
            type: 'line',
            label: 'Total',
            backgroundColor: '#4edada',
            borderColor: '#4bc0c0',
            fill: false,
            data: Object.keys(this.stats_by_date).map(k => this.stats_by_date[k].wins - this.stats_by_date[k].losses)
          },
          {
            type: 'bar',
            label: 'Wins',
            backgroundColor: '#cdffc9',
            borderColor: '#1f801b',
            data: Object.keys(this.stats_by_date).map(k => this.stats_by_date[k].wins)
          },
          {
            type: 'bar',
            label: 'Losses',
            backgroundColor: '#ff8a98',
            borderColor: '#ff00be',
            data: Object.keys(this.stats_by_date).map(k => this.stats_by_date[k].losses * (-1))
          },
        ]
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            type: "time",
            display: true,
            time: {
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: {
                'millisecond': 'DD.MM.',
                'second': 'DD.MM.',
                'minute': 'DD.MM.',
                'hour': 'DD.MM.',
                'day': 'DD.MM.',
                'week': 'DD.MM.',
                'month': 'DD.MM.',
                'quarter': 'DD.MM.',
                'year': 'DD.MM.',
              }
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        },
      }
    };

    let ctx = (<HTMLCanvasElement>this.winrate_chart_canvas.nativeElement).getContext("2d");
    let winrate_chart = new Chart(ctx, config);

    if (!this.initialized) {
      this.initialized = true;
    }
  }

  ngOnInit() {
    this.updateGraph();
  }

  ngOnChanges(changes) {
    if (this.initialized && changes['stats_by_date'].currentValue !== changes['stats_by_date'].previousValue) {
      this.updateGraph();
    }
  }

}
