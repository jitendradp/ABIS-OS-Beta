import {Injectable} from '@angular/core';

export type LocationInformation = {
  createdAt: string,
  name: string,
  address: string,
  city: string,
  zip_code: string,
  country: string,
  latitude: number,
  longitude: number,
  radius_meter: number,
  tags: string,
  visitors_count: number,
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
    "zip_code": "80339",
    "latitude": 49.2323232,
    "longitude": 8.3434343,
    "radius_meter": 89,
    "tags": "university, city, people, life, education",
    "visitors_count": 632,
  }
}
