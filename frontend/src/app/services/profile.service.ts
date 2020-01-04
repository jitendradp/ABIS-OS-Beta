import {Injectable} from '@angular/core';
import {CreateProfileGQL, GetProfileGQL, ListProfilesGQL, Profile, UpdateProfileGQL} from "../../generated/abis-api";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {AccountService} from "./account.service";
import {ActionDispatcherService} from "./action-dispatcher.service";
import {SessionProfileChanged} from "../actions/account/SessionProfileChanged";

export type ProfileInormation =  {
  name: string,
  type: string,
  slogan: string,
  picture: string,
  banner: string,
  status: string,
  job: string,
  phone: string
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public profileInformation:ProfileInormation = {
      "name": "Jessica",
      "type": "Work",
      "slogan": "Having fun with friends",
      "picture": "./assets/profile_default.jpg",
      "banner": "https://i.redd.it/s867gu6siij21.jpg",
      "status": "Online",
      "job": "Founder",
      "phone": "+49 0159 5467 464587"
  };

  private readonly _log:Logger = this.loggerService.createLogger("ProfileService");

  constructor(private createProfileApi:CreateProfileGQL
            , private updateProfileApi:UpdateProfileGQL
            , private listProfilesApi:ListProfilesGQL
            , private getProfileApi:GetProfileGQL
            , private accountService:AccountService
            , private actionDispatcher:ActionDispatcherService
            , private loggerService:LoggerService) {
    this.actionDispatcher.onAction.subscribe(event =>  {
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
  public createProfile(name:string, picture?:string, timezone?:string) : Promise<string> {
    return this.createProfileApi.mutate({
      csrfToken: this.accountService.csrfToken,
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

  updateProfile(profileId:string, name:string, picture?:string, timezone?:string) : Promise<boolean> {
    return this.updateProfileApi.mutate({
      csrfToken: this.accountService.csrfToken,
      profileId,
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

  listProfiles() : Promise<Profile[]> {
    return this.listProfilesApi.fetch({csrfToken:this.accountService.csrfToken})
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

  getProfile(profileId:string) : Promise<Profile> {
    return this.getProfileApi.fetch({
      csrfToken: this.accountService.csrfToken,
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
