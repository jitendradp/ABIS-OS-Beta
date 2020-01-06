import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../../services/profile.service";
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile:{name?:string,job?:string,slogan?:string,phone?:string} = {};
  public account:{name?:string} = {};

  constructor(
    private _profileService: ProfileService,
    private _accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.account = this._accountService.accountInformation
  }

}
