import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent{
  createProfileService: string;

  constructor(private userService: UserService) {
    this.createProfileService = this.userService.systemServices.find(o => o.name == "CreateProfileService").id;
  }
}
