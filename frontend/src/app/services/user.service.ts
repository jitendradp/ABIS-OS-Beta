import {Injectable} from '@angular/core';

export type UserInformation = {
  firstName: string,
  lastName: string,
  timezone: string,
  email: string,
};

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public userInformation: UserInformation = {
    "firstName": "Thomas",
    "lastName": "Cook",
    "timezone": "UTC +1",
    "email": "john.doe@abis-cloud.com",
  }
}
