import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{
  signupServiceId: string;

  constructor(private userService: UserService) {
    this.signupServiceId = this.userService.systemServices.find(o => o.name == "SignupService").id;
  }
}
