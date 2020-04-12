import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent {

  @Input()
  collapsed: boolean;

  @Input()
  showActions: boolean;
  entries: any[] = [
    {
      type:"Profile",
      name: 'John Doe',
      slogan: 'Wuuuuuzzzaaa!',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/50/50',
      status: 'offline',
    },
    {
      type:"Profile",
      name: 'John Doe',
      slogan: 'Tomorrow is gonna be a bright, bright day',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/100/100',
      status: 'online',
    },
    {
      type:"Profile",
      name: 'John Doe',
      slogan: 'Eat my shorts!',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/200/200',
      status: 'online',
    },
    {
      type:"Profile",
      name: 'John Doe',
      slogan: 'Deine Mudda!',
      lastSeen: 'Friday, 2020-01-01 9:15 AM',
      picture: 'https://www.fillmurray.com/150/150',
      status: 'away',
    },
  ];

}
