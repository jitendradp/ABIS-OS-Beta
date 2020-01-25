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
  createdAt: string;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  pictureCreator: string;

  @Input()
  picturePost: string;

  @Input()
  collapsedSplit: boolean;

}
