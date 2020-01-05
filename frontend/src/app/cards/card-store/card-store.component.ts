import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-store',
  templateUrl: './card-store.component.html',
  styleUrls: ['./card-store.component.css']
})
export class CardStoreComponent {

  @Input()
  accordionTitle: string;

  @Input()
  accordionDescription: string;

  @Input()
  showAccordion: boolean;

  @Input()
  lockedContent: boolean;

  @Input()
  status: string;

  @Input()
  showStatus: boolean;

  @Input()
  action: string;

  @Input()
  link: string;

  @Input()
  showMaxButton: boolean;

  @Input()
  showActionList: boolean;

  @Input()
  showContent: boolean;

  @Input()
  image: string;

  @Input()
  statsIcon: string;

  @Input()
  statsLeft: string;

  @Input()
  statsRight: string;

  @Input()
  icon: string;

  @Input()
  showImage: boolean;

  @Input()
  showIcon: boolean;

  @Input()
  creator: string;

  @Input()
  creationDate: string;

  @Input()
  showStats: boolean;

  @Input()
  title: string;

  @Input()
  subtitle: string;
  panelOpenState: boolean;

}
