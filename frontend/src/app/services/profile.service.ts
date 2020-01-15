import {Injectable} from '@angular/core';

export type ProfileInformation = {
  displayName: string,
  timezone: string,
  slogan: string,
  picture: string,
  location: string,
  type: string,
  isBot: boolean;
  isHidden: boolean,
  createdAt: string,
  status: string,
};


@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  public profileInformation: ProfileInformation = {
    "displayName": "Tom",
    "timezone": "UTC +1",
    "slogan": "Exploring the world",
    "picture": "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/1:1/w_722,h_722,c_limit/phonepicutres-TA.jpg",
    "location": "Munich",
    "type": "Work",
    "isBot": false,
    "isHidden": false,
    "createdAt": "2020-01-02",
    "status": "Busy",
  };
}
