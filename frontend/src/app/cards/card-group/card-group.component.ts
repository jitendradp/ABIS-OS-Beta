import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.css']
})
export class CardGroupComponent {


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
