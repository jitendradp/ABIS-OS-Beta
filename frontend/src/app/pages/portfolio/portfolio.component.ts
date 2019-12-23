import {Component, OnInit} from '@angular/core';
import {Portfolio} from "../portfolio/portfolio.component";

export interface Portfolio {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  portfolios: Portfolio[] = [
    {value: 'portfolio-0', viewValue: 'Test'},
    {value: 'portfolio-1', viewValue: 'Real Money'},
    {value: 'portfolio-2', viewValue: 'High Risky'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
