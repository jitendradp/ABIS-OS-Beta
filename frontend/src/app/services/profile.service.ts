import {Injectable} from '@angular/core';
import {
  CreateProfileGQL,
  GetProfileGQL,
  ListProfilesGQL,
  Profile,
  ProfileType,
  UpdateProfileGQL
} from "../../generated/abis-api";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {UserService} from "./user.service";
import {ActionDispatcherService} from "./action-dispatcher.service";
import {SessionProfileChanged} from "../actions/user/SessionProfileChanged";

export type ProfileInformation = {
  name: string,
  timezone: string,
  slogan: string,
  picture: string,
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
    "picture": "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/1:1/w_722,h_722,c_limit/phonepicutres-TA.jpg",
    "location": "Munich",
    "type": "Work",
    "isBot": false,
    "isHidden": false,
    "createdAt": "2020-01-02",
    "status": "Busy",
  };

  private readonly _log: Logger = this.loggerService.createLogger("ProfileService");

  constructor(private createProfileApi: CreateProfileGQL
    , private updateProfileApi: UpdateProfileGQL
    , private listProfilesApi: ListProfilesGQL
    , private getProfileApi: GetProfileGQL
    , private userService: UserService
    , private actionDispatcher: ActionDispatcherService
    , private loggerService: LoggerService) {
    this.actionDispatcher.onAction.subscribe(event => {
      if (event instanceof SessionProfileChanged) {
        this.getProfile(event.newValue)
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

  /**
   * Creates a profile and returns its id.
   * @param name
   * @param picture
   * @param timezone
   */
  public createProfile(type:ProfileType, name: string, picture?: string, timezone?: string): Promise<string> {
    return this.createProfileApi.mutate({
      csrfToken: this.userService.csrfToken,
      type,
      name,
      picture,
      timezone
    }).toPromise()
      .then(result => {
        return result.data.createProfile;
      })
      .catch(error => {
        this._log(LogSeverity.UserNotification, "The profile creation failed. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return null;
      });
  }

  updateProfile(profileId: string, type:ProfileType, name: string, picture?: string, timezone?: string): Promise<boolean> {
    return this.updateProfileApi.mutate({
      csrfToken: this.userService.csrfToken,
      profileId,
      type,
      name,
      picture,
      status,
      timezone
    })
      .toPromise()
      .then(() => {
        return true;
      })
      .catch(error => {
        this._log(LogSeverity.UserNotification, "The profile couldn't be updated. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return false;
      });
  }

  listProfiles(): Promise<Profile[]> {
    return this.listProfilesApi.fetch({csrfToken: this.userService.csrfToken})
      .toPromise()
      .then(result => {
        return result.data.listProfiles;
      })
      .catch(error => {
        this._log(LogSeverity.UserNotification, "The profiles couldn't be listed. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return null;
      });
  }

  getProfile(profileId: string): Promise<Profile> {
    return this.getProfileApi.fetch({
      csrfToken: this.userService.csrfToken,
      profileId
    })
      .toPromise()
      .then(result => {
        return result.data.getProfile;
      })
      .catch(error => {
        this._log(LogSeverity.UserNotification, "The profiles couldn't be read. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return null;
      });
  }
}
