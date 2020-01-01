import {Component} from '@angular/core';
import {DataspaceService} from "../../services/dataspace.service";
import {Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {ProfileService} from "../../services/profile.service";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

export interface Channel {
  name: string;
  icon: string;
  tag: string;
}

export interface DirectMessage {
  name: string;
  status: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  constructor(
    protected _actionDispatcher:ActionDispatcherService
  ) {}

  channels: Channel[] = [
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
  members: DirectMessage[] = [
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
