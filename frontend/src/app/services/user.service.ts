import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
  }

  getUserInformation() {
    return {
      "firstName": "Thomas",
      "lastName": "Cook",
      "timezone": "UTC +1",
      "email": "john.doe@abis-cloud.com",
    }
  }

}
