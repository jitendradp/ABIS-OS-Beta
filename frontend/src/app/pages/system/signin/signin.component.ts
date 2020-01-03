import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {Logger, LoggerService, LogSeverity} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {SwitchProfile} from "../../../actions/routes/SwitchProfile";
import {ProfileService} from "../../../services/profile.service";
import {Home} from "../../../actions/routes/Home";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @ViewChild("email", {static:true})
  email:ElementRef;

  @ViewChild("password", {static:true})
  password:ElementRef;

  private readonly _log:Logger = this.loggerService.createLogger("SigninComponent");

  constructor(private accountService:AccountService
    , private loggerService:LoggerService
    , private profileService:ProfileService
    , private actionDispatcherr:ActionDispatcherService) {
  }

  ngOnInit() {
  }

  async login() : Promise<void> {
    try {
      const loginResult = await this.accountService.login(this.email.nativeElement.value, this.password.nativeElement.value);
      if (!loginResult) {
        return;
      }

      const  userProfiles = await this.profileService.listProfiles();

      if (userProfiles.length == 0) {
        this._log(LogSeverity.UserNotification, "You're successfully logged-in, but you don't yet have any profiles. Create a profile to proceed.");
        // TODO: redirect the user to a page where he can add a profile
        return;
      }

      if (userProfiles.length == 1) {
        const  result = await this.accountService.setSessionProfile(userProfiles[0].id);
        if (!result) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error("Unexpected error while setting the session profile.")
        }
        this.actionDispatcherr.dispatch(new Home());
        return;
      }

      this.actionDispatcherr.dispatch(new SwitchProfile());
    } catch (e) {
      this._log(LogSeverity.UserNotification, "An error occurred during log-on. See the log for detailed error messages.");
      this._log(LogSeverity.Error, e);
      throw e;
    }
  }
}
