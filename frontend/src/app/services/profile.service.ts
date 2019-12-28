import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() {
  }

  getProfileInformation() {
    return {
      "fullName": "Jessica Cohen",
      "slogan": "Having fun with friends",
      "picture": "./assets/profile_default.jpg",
      "banner": "https://i.redd.it/s867gu6siij21.jpg",
      "status": "Online",
      "job": "Founder",
      "displayName": "Jessica",
      "phone": "+49 0159 5467 464587"
    }
  }

}
