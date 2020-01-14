import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-store',
  templateUrl: './card-store.component.html',
  styleUrls: ['./card-store.component.css']
})
export class CardStoreComponent {

  @Input()
  title: string;

  @Input()
  isDisabled: boolean;

  @Input()
  subtitle: string;

  @Input()
  publisher: string;

  @Input()
  team: string;

  @Input()
  description: string;

  @Input()
  logo: string;

  @Input()
  link: string;

}
