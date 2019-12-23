import {Component, OnInit} from '@angular/core';

export interface Account {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  accounts: Account[] = [
    {value: 'account-0', viewValue: 'Team Marketing'},
    {value: 'account-1', viewValue: 'Team Controlling'},
    {value: 'account-2', viewValue: 'Team Engine'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
