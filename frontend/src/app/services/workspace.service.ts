import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor() {
  }

  getWorkspaceInformation() {
    return {
      "name": "DBI Analytics GmbH",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png",
      "type": "Public",
      "city": "Munich",
      "address": "Ridlerstr. 35",
      "country": "Germany",
      "tags": ["Sport", "Work"]
    }
  }
}
