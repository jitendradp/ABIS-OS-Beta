import {Component} from '@angular/core';

export interface storeItem {
  name: string;
  shortDescription: string;
  logo: string;
  status: string;
  publisher: string;
  description: string;
  website: string;

  //todo if status is "installed" show different button title and link
  buttonTitle: string;
  buttonLink: string;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  //todo implement from storeItemService

  items: storeItem[] = [
    {
      name: 'Smart Pharmacy App',
      shortDescription: 'Market data for german pharmacies',
      logo: './assets/logos/apowi.png',
      status: 'Deployed',
      publisher: 'Apowi - Campus Essen',
      description: 'Discover monthly results from surveys of more than 800 local pharmacies all around Germany.',
      website: 'https://apowi.net/',
      buttonTitle: 'Discover',
      buttonLink: '/map',
    },
    {
      name: 'Smart Crypto App',
      shortDescription: 'Your portfolio simulation for crypto currency markets',
      logo: '',
      status: 'Setup',
      publisher: 'DynaGroup Information Technologies GmbH',
      description: 'Discover worldwide crypto markets and boost your portfolio analysis.',
      website: 'https://www.dynagroup.de/',
      buttonTitle: 'Setup',
      buttonLink: '/map',
    },
    {
      name: 'Smart Budget Controlling App',
      shortDescription: 'Your portfolio simulation for crypto currency markets',
      logo: './assets/logos/munichMotorsport.png',
      status: 'Setup',
      publisher: 'municHMotorsport e.V.',
      description: 'Discover worldwide crypto markets and boost your portfolio analysis.',
      website: 'https://www.munichmotorsport.de/',
      buttonTitle: 'Setup',
      buttonLink: '/map',
    },
  ];
}
