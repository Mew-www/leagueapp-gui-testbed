import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'squarebrace-titled-container',
  templateUrl: './squarebrace-titled-container.component.html',
  styleUrls: ['./squarebrace-titled-container.component.scss']
})
export class SquarebraceTitledContainerComponent implements OnInit {

  @Input() title: string;
  @Input() captionlike_title: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
