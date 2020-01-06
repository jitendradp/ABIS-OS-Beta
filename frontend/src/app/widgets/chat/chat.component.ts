import {Component} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";


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


  constructor(public actionDispatcher: ActionDispatcherService) {
  }


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
