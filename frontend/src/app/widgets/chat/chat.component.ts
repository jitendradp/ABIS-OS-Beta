import {Component} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {FormControl} from "@angular/forms";

export interface Channel {
  name: string;
  icon: string;
  team: string;
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

  teams = new FormControl();
  teamList: string[] = ['DBI Analytics GmbH', 'Audi Marketing', 'BMW Racing', 'Huber AG', 'FH München', 'Frankfurter Allgemeine'];

  constructor(
    protected _actionDispatcher: ActionDispatcherService
  ) {
  }

  channels: Channel[] = [
    {
      name: 'General',
      icon: 'bubble_chart',
      team: 'DBI Analytics GmbH'
    },
    {
      name: 'Einkauf',
      icon: 'lock',
      team: 'Audi Marketing'
    },
    {
      name: 'Chaos',
      icon: 'lock',
      team: 'BMW Racing'
    },
    {
      name: 'OEM Plannung',
      icon: 'bubble_chart',
      team: 'Huber AG'
    },
    {
      name: 'Zulieferer',
      icon: 'bubble_chart',
      team: 'Huber AG'
    },
    {
      name: 'Party',
      icon: 'bubble_chart',
      team: 'FH München'
    },
    {
      name: 'News',
      icon: 'bubble_chart',
      team: 'Frankfurter Allgemeine'
    },
    {
      name: 'Alumni',
      icon: 'lock',
      team: 'FH München'
    },
    {
      name: 'General',
      icon: 'lock',
      team: 'BMW Racing'
    },
    {
      name: 'Vertrieb',
      icon: 'bubble_chart',
      team: 'BMW Racing'
    },
    {
      name: 'Marketing',
      icon: 'bubble_chart',
      team: 'BMW Racing'
    },
    {
      name: 'Kundensupport',
      icon: 'bubble_chart',
      team: 'DBI Analytics GmbH'
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
