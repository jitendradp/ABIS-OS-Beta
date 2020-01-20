import {Injectable} from '@angular/core';

export type LocationInformation = {
  createdAt: string,
  name: string,
  address: string,
  city: string,
  zipCode: string,
  country: string,
  latitude: number,
  longitude: number,
  radiusMeter: number,
  tags: string,
  visitorsCount: number,
};


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public locationInformation: LocationInformation = {
    "createdAt": "2019-09-21",
    "name": "tum",
    "address": "Dieselstr. 22b",
    "city": "Munich",
    "country": "Germany",
    "zipCode": "80339",
    "latitude": 49.2323232,
    "longitude": 8.3434343,
    "radiusMeter": 89,
    "tags": "university, city, people, life, education",
    "visitorsCount": 632,
  }
}
