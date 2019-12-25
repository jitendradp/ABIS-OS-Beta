import {Component, Input, OnInit} from '@angular/core';

export interface IPortfolio {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  @Input()
  showWidget:boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
