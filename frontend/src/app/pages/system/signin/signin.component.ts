import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Logger, LoggerService} from "../../../services/logger.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  loginServiceId: string;
  private readonly _log: Logger = this.loggerService.createLogger("SigninComponent");

  constructor(private userService: UserService, private loggerService: LoggerService) {
    this.loginServiceId = this.userService.systemServices.find(o => o.name == "LoginService").id;
  }
}
