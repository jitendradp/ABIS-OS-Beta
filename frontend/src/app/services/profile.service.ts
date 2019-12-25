import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() {
  }

  getProfileInformation() {
    return {
      "name": "Dave Chang",
      "slogan": "Having fun with coding",
      "picture": "https://abis-cloud.de/wp-content/uploads/2019/05/david-at-the-tum-be5-hackathon.jpg",
      "banner": "https://i.redd.it/s867gu6siij21.jpg",
      "status": "Offline"
    }
  }

}
