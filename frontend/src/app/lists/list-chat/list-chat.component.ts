import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.css']
})
export class ListChatComponent {


  @Input()
  collapsed: boolean;

  @Input()
  showActions: boolean;

}
