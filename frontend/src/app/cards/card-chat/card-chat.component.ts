import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-chat',
  templateUrl: './card-chat.component.html',
  styleUrls: ['./card-chat.component.css']
})
export class CardChatComponent {

  @Input()
  chatGroupLogo: string;

  @Input()
  chatGroupTitle: string;

  @Input()
  chatGroupSubtitle: string;

  @Input()
  chatGroupMembersCount: number;

  @Input()
  chatGroupDescription: string;


}
