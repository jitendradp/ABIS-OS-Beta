import {Component, Input} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  constructor(public actionDispatcher: ActionDispatcherService) {
  }

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

  @Input()
  collapsed: boolean;

  @Input()
  statusMenu: any;

  @Input()
  headerBackground: string;

  @Input()
  headerTextColor: string;
}


