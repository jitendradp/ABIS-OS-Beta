import {AfterViewInit, Component} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Logger, LoggerService} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {ShowNotification} from "../../../actions/ui/ShowNotification";
import {Back} from "../../../actions/routes/Back";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {

  signupServiceId: string;
  private readonly _log: Logger = this.loggerService.createLogger("RegisterComponent");

  constructor(private userService: UserService, private loggerService: LoggerService, private actionDispatcher: ActionDispatcherService) {
    this.signupServiceId = this.userService.systemServices.find(o => o.name == "SignupService").id;
  }

  ngAfterViewInit(): void {
    const f = () => {
      if (this.userService.isLoggedOn) {
        this.actionDispatcher.dispatch(new ShowNotification("You cannot sign up a new user while being logged-on. Log out first and then create a new user. Also try if another profile fits your need."));
        this.actionDispatcher.dispatch(new Back());
        return;
      }
    };
    if (document.referrer == "") {
      setTimeout(f, 500);
    } else {
      f();
    }
  }
}
