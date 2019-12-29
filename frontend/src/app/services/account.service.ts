import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  getAccountInformation() {
    return {
      "email": "jessica@gmail.com",
      "firstname": "Jesscia",
      "lastname": "Cohen",
    }
  }
}
