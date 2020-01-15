import {Component} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.css']
})
export class CardProfileComponent {

  constructor(
    protected userService: UserService,
    protected profileService: ProfileService,) {
  }

}
