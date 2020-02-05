import {Injectable} from '@angular/core';
import {
  MyProfilesGQL,
  Profile,
  ProfileType,
} from "../../generated/abis-api";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {UserService} from "./user.service";
import {ActionDispatcherService} from "./action-dispatcher.service";
import {SessionProfileChanged} from "../actions/user/SessionProfileChanged";

export type ProfileInformation = {
  name: string,
  timezone: string,
  slogan: string,
  pictureAvatar: string,
  location: string,
  type: string,
  isBot: boolean;
  isHidden: boolean,
  createdAt: string,
  status: string,
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public profileInformation: ProfileInformation = {
    "name": "tomsawyer88",
    "timezone": "UTC +1",
    "slogan": "Exploring the world",
    "pictureAvatar": "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/1:1/w_722,h_722,c_limit/phonepicutres-TA.jpg",
    "location": "Munich",
    "type": "Work",
    "isBot": false,
    "isHidden": false,
    "createdAt": "2020-01-02",
    "status": "Busy",
  };

  private readonly _log: Logger = this.loggerService.createLogger("ProfileService");

  constructor(private userService: UserService
    , private myProfilesApi: MyProfilesGQL
    , private actionDispatcher: ActionDispatcherService
    , private loggerService: LoggerService) {
    this.actionDispatcher.onAction.subscribe(event => {
      if (event instanceof SessionProfileChanged) {
        this.myProfilesApi.fetch({csrfToken:this.userService.csrfToken}).toPromise()
          .then(result => {
            console.log("Profile:", result);
          })
          .catch(error => {
            this._log(LogSeverity.UserNotification, "The profile creation failed. See the log for detailed error messages.");
            this._log(LogSeverity.Error, error);
          });
      }
    });
  }
}
