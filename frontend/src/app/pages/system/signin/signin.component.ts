import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {Logger, LoggerService, LogSeverity} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {SwitchProfile} from "../../../actions/routes/SwitchProfile";

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

  constructor(private _accountService:AccountService
    , private loggerService:LoggerService
    , private actionDispatcherr:ActionDispatcherService) {
  }

  ngOnInit() {
  }

  login() {
    this._accountService.login(this.email.nativeElement.value, this.password.nativeElement.value)
      .then(result => {
        if (!result) {
          return;
        }
        this.actionDispatcherr.dispatch(new SwitchProfile());
      })
      .catch(error => {
        this._log(LogSeverity.Error, "The login failed. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
      });
  }
}
