import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input()
  picture: string;

  @Input()
  cardHeight: string = "100%";

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  showHeader: boolean;

  @Input()
  showPicture: boolean;

  @Input()
  showOverlayMenu: boolean;

  @Input()
  showContent: boolean;
  collapsed: boolean;
  statusMenu: any;
}


