import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-message',
  templateUrl: './card-message.component.html',
  styleUrls: ['./card-message.component.css']
})
export class CardMessageComponent {

  @Input()
  creator: string;

  @Input()
  creationDate: string;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  picture: string;

}
