import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  changePasswordService: string;

  constructor(private userService: UserService) {
    this.changePasswordService = this.userService.systemServices.find(o => o.name == "SetPasswordService").id;
  }
}
