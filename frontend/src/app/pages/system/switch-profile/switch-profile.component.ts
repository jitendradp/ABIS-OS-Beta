import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Profile} from "../../../../generated/abis-api";
import {AccountService} from "../../../services/account.service";
import {Profile_oldService} from "../../../services/profile_old.service";
import {Logger, LoggerService, LogSeverity} from "../../../services/logger.service";

@Component({
  selector: 'app-switch-profile',
  templateUrl: './switch-profile.component.html',
  styleUrls: ['./switch-profile.component.css']
})
export class SwitchProfileComponent implements OnInit, AfterViewInit {
  public profiles:Profile[] = [];

  private readonly _log:Logger = this.loggerService.createLogger("SwitchProfileComponent");

  constructor(private profileService:Profile_oldService
              , private accountService:AccountService
              , private loggerService:LoggerService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.profileService.listProfiles()
      .then(o => this.profiles = o)
      .catch(error => {
        this._log(LogSeverity.UserNotification, "The profiles couldn't be listed. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
      });
  }

  switchToProfile(profile: Profile) {
    this.accountService.setSessionProfile(profile.id)
      .catch(error => {
        this._log(LogSeverity.UserNotification, "Couldn't switch profile. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
      });
  }
}
