import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  getProfileInformation() {
    return {
      "name": "Jessica",
      "type": "Work",
      "slogan": "Having fun with friends",
      "picture": "./assets/profile_default.jpg",
      "banner": "https://i.redd.it/s867gu6siij21.jpg",
      "status": "Online",
      "job": "Founder",
      "phone": "+49 0159 5467 464587"
    }
  }
}
