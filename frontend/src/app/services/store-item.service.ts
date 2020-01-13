import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreItemService {

  constructor() {
  }

  getStoreItemInformation() {
    return {
      "name": "ZULU Label Inc.",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/6/63/Ingress_Logo.png",
      "type": "Public",
      "description": "Hi there",
    }
  }
}
