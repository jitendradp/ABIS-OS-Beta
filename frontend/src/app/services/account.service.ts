import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _token: string;

  constructor(private apollo: Apollo) {
  }

  login(email: string, password: string) {
    const loginMutation = gql`
    mutation login($email:String! $password:String!) {
      login(email:$email password:$password)
    }`;
    this.apollo.mutate({
      mutation: loginMutation,
      variables: {
        "email": email,
        "password": password
      }
    }).subscribe(({data}) => {
      console.log('logged in', data);
      this._token = <string>(<any>data).login;
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  logout() {
  }

  getAccountInformation() {
    return {
      "email": "jessica@gmail.com",
      "firstname": "Jesscia",
      "lastname": "Cohen",
    }
  }
}
