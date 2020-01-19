import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../../services/profile.service";
import {UserService} from "../../../services/user.service";
import {UserInformation} from "../../../../generated/abis-api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile: { name?: string, job?: string, slogan?: string, phone?: string } = {};
  public user: UserInformation = {id: null, createdAt: null, firstName: "", lastName: ""};

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.user = this.userService.userInformation
  }

}
