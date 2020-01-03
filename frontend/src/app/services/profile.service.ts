import {Injectable} from '@angular/core';
import {CreateProfileGQL, GetProfileGQL, ListProfilesGQL, Profile, UpdateProfileGQL} from "../../generated/abis-api";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {ClientStateService} from "./client-state.service";
import {AccountService} from "./account.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  getProfileInformation() {
    return {
      "name": "Jessica",
      "type": "Work",
      "slogan": "Having fun with friends",
      "picture": "./assets/profile_default.jpg",
      "banner": "https://i.redd.it/s867gu6siij21.jpg",
      "status": "Online",
      "job": "Founder",
      "phone": "+49 0159 5467 464587"
    }
  }

  private readonly _log:Logger = this.loggerService.createLogger("ProfileService");

  constructor(private createProfileApi:CreateProfileGQL
            , private updateProfileApi:UpdateProfileGQL
            , private listProfilesApi:ListProfilesGQL
            , private getProfileApi:GetProfileGQL
            , private accountService:AccountService
            , private loggerService:LoggerService) {
  }

  /**
   * Creates a profile and returns its id.
   * @param token
   * @param name
   * @param picture
   * @param timezone
   */
  public createProfile(token:string, name:string, picture?:string, timezone?:string) : Promise<string> {
    return this.createProfileApi.mutate({
      token,
      name,
      picture,
      timezone
    }).toPromise()
      .then(result => {
        return result.data.createProfile;
      })
      .catch(error => {
        this._log(LogSeverity.Error, "The profile creation failed. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return null;
      });
  }

  updateProfile(token:string, profileId:string, name:string, picture?:string, timezone?:string) : Promise<boolean> {
    return this.updateProfileApi.mutate({
      token,
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
        this._log(LogSeverity.Error, "The profile couldn't be updated. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return false;
      });
  }

  listProfiles() : Promise<Profile[]> {
    return this.listProfilesApi.fetch({token:this.accountService.token})
      .toPromise()
      .then(result => {
        return result.data.listProfiles;
      })
      .catch(error => {
        this._log(LogSeverity.Error, "The profiles couldn't be listed. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return null;
      });
  }

  getProfile(profileId:string) : Promise<Profile> {
    return this.getProfileApi.fetch({
      token: this.accountService.token,
      profileId
    })
      .toPromise()
      .then(result => {
        return result.data.getProfile;
      })
      .catch(error => {
        this._log(LogSeverity.Error, "The profiles couldn't be read. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return null;
      });
  }
}
