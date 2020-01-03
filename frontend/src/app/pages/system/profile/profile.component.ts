import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../../services/profile.service";
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile = {};
  public account = {};

  constructor(
    private _profileService: ProfileService,
    private _accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.profile = this._profileService.getProfileInformation();
    this.account = this._accountService.accountInformation
  }

}
