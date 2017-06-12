import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'winrate-graph',
  templateUrl: './winrate-graph.component.html',
  styleUrls: ['./winrate-graph.component.scss']
})
export class WinrateGraphComponent implements OnInit {

  constructor() { }

  private updateGraph() {

    var randomScalingFactor = function() {
      return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    };

    let event_display_format = 'DD/MM/YYYY';

    let config = {
      type: 'bar',
      data: {
        labels: [
          moment('12-6-2017','DD-MM-YYYY'),
          moment('13-6-2017','DD-MM-YYYY'),
          moment('14-6-2017','DD-MM-YYYY'),
          moment('17-6-2017','DD-MM-YYYY'),
          moment('18-6-2017','DD-MM-YYYY'),
          moment('19-6-2017','DD-MM-YYYY'),
          moment('20-6-2017','DD-MM-YYYY')
        ],
        datasets: [
          {
            type: 'line',
            label: 'Total',
            backgroundColor: '#4edada',
            borderColor: '#4bc0c0',
            fill: false,
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor()
            ],
          },
          {
            type: 'bar',
            label: 'Wins',
            backgroundColor: '#cdffc9',
            borderColor: '#1f801b',
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor()
            ],
          },
          {
            type: 'bar',
            label: 'Losses',
            backgroundColor: '#ff8a98',
            borderColor: '#ff00be',
            data: [
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor(),
              randomScalingFactor()
            ],
          },
        ]
      },
      options: {
        scales: {
          xAxes: [{
            type: "time",
            display: true,
            time: {
              tooltipFormat: event_display_format,
              unit: 'day',
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
        },
      }
    };

    let ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d");
    let winrate_chart = new Chart(ctx, config);

  }

  ngOnInit() {
    this.updateGraph();
  }

}
