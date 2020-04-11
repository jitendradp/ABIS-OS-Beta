import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordService: string;

  constructor(private userService: UserService) {
    this.changePasswordService = this.userService.systemServices.find(o => o.name == "ChangePasswordService").id;
  }
}
