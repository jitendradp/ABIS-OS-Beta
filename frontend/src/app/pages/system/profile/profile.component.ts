import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../../services/profile.service";
import {UserService} from "../../../services/user.service";
import {AccountInformation} from "../../../../generated/abis-api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile:{name?:string,job?:string,slogan?:string,phone?:string} = {};
  public account:AccountInformation = {id:null, createdAt:null, firstName:"", lastName:""};

  constructor(
    private _profileService: ProfileService,
    private _userService: UserService
  ) {
  }

  ngOnInit() {
    this.account = this._userService.accountInformation
  }

}
