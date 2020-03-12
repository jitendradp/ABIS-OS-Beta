import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-signin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginServiceId: string;

  constructor(private userService: UserService) {
    this.loginServiceId = this.userService.systemServices.find(o => o.name == "LoginService").id;
  }
}
