import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Account, MyAccountGQL, UserType} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-editor-account',
  templateUrl: './editor-account.component.html',
  styleUrls: ['./editor-account.component.css']
})
export class EditorAccountComponent implements OnChanges {
  password: string;
  passwordConfirmation: string;

  @Input()
  account: Account = {
    id: "",
    createdAt: "",
    timezone: "",
    type: UserType.Person,
    email: "",
    personLastName: "",
    personFirstName: "",
    personMobilePhone: "",
    organizationName: "",
    personPhone: "",
  };

  constructor(private userService:UserService
      , private accountApi: MyAccountGQL) { }

  private loadAccount() {
    this.accountApi.fetch({csrfToken: this.userService.csrfToken})
      .toPromise()
      .then(account => {
        this.account = <Account>account.data.myAccount;
      });
  }

  private saveAccount() {
  }

  ngOnInit() {
    this.loadAccount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["accountId"]) {
      this.loadAccount();
    }
    if (changes["account"]) {
      this.password = "";
      this.passwordConfirmation = "";
    }
  }
}
