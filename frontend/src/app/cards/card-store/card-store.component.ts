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
  subtitle: string;

  @Input()
  publisher: string;

  @Input()
  websiteUrl: string;

  @Input()
  releaseDate: string;

  @Input()
  description: string;

  @Input()
  logo: string;

  @Input()
  image: string;

  @Input()
  buttonTitle: string;

  @Input()
  buttonLink: string;

  @Input()
  installsCount: number;

  @Input()
  pricePerMonth: number;

  @Input()
  autoRenew: string;

  @Input()
  subscription: string;

}
