import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-room',
  templateUrl: './card-room.component.html',
  styleUrls: ['./card-room.component.css']
})
export class CardRoomComponent {


  @Input()
  name: string;

  @Input()
  pictureLogo: string;

  @Input()
  title: string;

  @Input()
  creator: string;

  @Input()
  tags: string;

  @Input()
  description: string;

  @Input()
  location: string;

  @Input()
  membersTotal: number;

  @Input()
  membersLive: number;

  @Input()
  buttonLink: string;

}
