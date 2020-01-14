import {Component} from '@angular/core';

export interface storeItem {
  name: string;
  shortDescription: string;
  logo: string;
  status: string;
  publisher: string;
  description: string;
  team: string;
  setupLink: string;
  discoverLink: string;
  isInstalled: boolean;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  //todo implement the following array to the store-item.service.ts

  items: storeItem[] = [
    {
      name: 'Smart Pharmacy App',
      shortDescription: 'Market data for german pharmacies',
      logo: './assets/logos/apowi.png',
      status: 'Deployed',
      publisher: 'Apowi - Campus Essen',
      description: 'Discover monthly results from surveys of more than 800 local pharmacies all around Germany.',
      team: '/teams',
      setupLink: '/map',
      discoverLink: '/map',
      isInstalled: true,
    },
    {
      name: 'Smart Crypto App',
      shortDescription: 'Crypto currency markets watch',
      logo: '',
      status: 'Setup',
      publisher: 'DynaGroup Information Technologies GmbH',
      description: 'Discover worldwide crypto currency markets and run simulations to analyze your portfolio.',
      team: '/teams',
      setupLink: '/smart-crypto-app-setup',
      discoverLink: '/smart-crypto-app-dashboard',
      isInstalled: false,
    },
    {
      name: 'Smart Budget App',
      shortDescription: 'Allocate and monitor your team budgets',
      logo: './assets/logos/munichMotorsport.png',
      status: 'Setup',
      publisher: 'munichMotorsport e.V.',
      description: 'Manage your budgets and monitor all expenses your team made. Stay aligned with your targets.',
      team: '/teams',
      setupLink: '/map',
      discoverLink: '/map',
      isInstalled: false,
    },
    {
      name: 'Smart Facebook Reporting App',
      shortDescription: 'Monitor and control your facebook campaigns',
      logo: './assets/logos/socialmediapirates.png',
      status: 'Setup',
      publisher: 'Socialmedia Piraten UG',
      description: 'Monitor and control your social media campaigns on facebook pages and facebook ads.',
      team: '/teams',
      setupLink: '/map',
      discoverLink: '/map',
      isInstalled: false,
    },
  ];
}
