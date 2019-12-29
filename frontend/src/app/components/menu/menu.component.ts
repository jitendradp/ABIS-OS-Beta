import {Component, Input} from '@angular/core';
import {DataspaceService} from "../../services/dataspace.service";
import {ProfileService} from "../../services/profile.service";

export interface Section_A {
  name: string;
  icon: string;
  tag: string;
}

export interface Section_B {
  name: string;
  status: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {

  @Input()
  isLoggedIn: boolean;

  public profile = {};

  public dataspace = {};

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
  ) {
  }

  ngOnInit() {
    this.profile = this._profileService.getProfileInformation();
    this.dataspace = this._dataspaceService.getDataspaceInformation();
  }

  channels: Section_A[] = [
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Infineon Technologies',
      icon: 'lock',
      tag: 'Work, Freelancer'
    },
    {
      name: 'Fishers Club',
      icon: 'lock',
      tag: 'Hobby, Family'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Infineon Technologies',
      icon: 'lock',
      tag: 'Work, Freelancer'
    },
    {
      name: 'Fishers Club',
      icon: 'lock',
      tag: 'Hobby, Family'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    },
    {
      name: 'Soccer FSB',
      icon: 'bubble_chart',
      tag: 'Sport, Soccer, Friends'
    }
  ];
  members: Section_B[] = [
    {
      name: 'Daniel Janz',
      status: 'offline'
    },
    {
      name: 'Moritz Bönke',
      status: 'offline'
    },
    {
      name: 'Thomas Müller',
      status: 'online'
    },
    {
      name: 'Steve Johnson',
      status: 'offline'
    },
    {
      name: 'Susi Tiel',
      status: 'online'
    },
    {
      name: 'Jasmin Huber',
      status: 'online'
    },
    {
      name: 'Alex Graup',
      status: 'online'
    },
    {
      name: 'Mr. Monkey',
      status: 'offline'
    }
  ];
}
