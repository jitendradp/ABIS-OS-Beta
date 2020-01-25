import {Component} from '@angular/core';

export interface Profile {
  name: string;
  lastSeen: string;
  picture: string;
  status: string;
}

@Component({
  selector: 'app-list-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.css']
})

export class ListMemberComponent {

  members: Profile [] = [
    {
      name: 'John Doe',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/50/50',
      status: 'offline',
    },
    {
      name: 'John Doe',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/100/100',
      status: 'online',
    },
    {
      name: 'John Doe',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/200/200',
      status: 'online',
    },
    {
      name: 'John Doe',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/150/150',
      status: 'away',
    },
  ];

}
