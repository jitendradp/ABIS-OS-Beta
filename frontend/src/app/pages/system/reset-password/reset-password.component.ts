import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordService: string;

  constructor(private userService: UserService) {
    this.resetPasswordService = this.userService.systemServices.find(o => o.name == "ResetPasswordService").id;
  }
}
