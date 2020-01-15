import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() {
  }

  getProfileInformation() {
    return {
      "displayName": "Tom",
      "timezone": "UTC +1",
      "slogan": "Discover the world",
      "picture": "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/1:1/w_722,h_722,c_limit/phonepicutres-TA.jpg",
      "location": "Munich",
      "createdAt": "2020-01-02",
      "status": "Busy",
    }
  }
}
