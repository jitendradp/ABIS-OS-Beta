import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataspaceService {

  constructor() {
  }

  getDataspaceInformation() {
    return {
      "name": "My profile",
      "owner": "Marco Polo",
      "ownerId": "8745454",
      "type": "Private"
    }
  }
}
