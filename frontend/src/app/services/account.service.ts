import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginState, LoginStateChanged} from "../actions/account/LoginStateChanged";
import {LoginGQL, LogoutGQL, SetSessionProfileGQL, VerifySessionGQL} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {SessionProfileChanged} from "../actions/account/SessionProfileChanged";
import {Apollo} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  getAccountInformation() {
    return {
      "email": "jessica@gmail.com",
      "firstname": "Jesscia",
      "lastname": "Cohen",
    }
  }

  private readonly _log:Logger = this.loggerService.createLogger("AccountService");

  public get token() : string {
    return this.clientState.get<string>(this.TokenKey, null).data;
  }
  private readonly TokenKey = "AccountService.token";

  public get profileId() : string {
    return this.clientState.get<string>(this.ProfileKey, null).data;
  }
  private readonly ProfileKey = "AccountService.profileId";

  public get isLoggedOn(): boolean {
    return this._isLoggedOn;
  }
  private _isLoggedOn:boolean;

  constructor(private actionDispatcher:ActionDispatcherService
              , private loggerService:LoggerService
              , private loginApi:LoginGQL
              , private logoutApi:LogoutGQL
              , private setSessionProfileApi:SetSessionProfileGQL
              , private verifySessionApi:VerifySessionGQL
              , private clientState:ClientStateService
              , private apollo:Apollo) {

    // TODO: this seems to be a bit hacky,, does the service really need to subscribe to its own events to know that?
    this.actionDispatcher.onAction.subscribe(action => {
      if (action instanceof LoginStateChanged) {
        this._isLoggedOn = action.newValue == 1;
      }
    });

    // If we have a stored token from a previous session, try to initialize the AccountService
    if (this.token) {
      this.setToken(this.token)
        .then(result => {
          if (!result) {
            return;
          }
          if (!this.profileId) {
            return;
          }
          // noinspection JSIgnoredPromiseFromCall
          this.setSessionProfile(this.profileId);
        });
    }
  }

  private clearClientState() {
    this.apollo.getClient().resetStore();
    this.clientState.delete(this.TokenKey);

    const oldProfileId = this.profileId;
    this.clientState.delete(this.ProfileKey);
    if (oldProfileId) {
      this.actionDispatcher.dispatch(new SessionProfileChanged(oldProfileId, null));
    }

    // If a user was logged on and the client state of the AccountService is cleared, then notify everybody that the user was logged-off.
    // The server session might be still alive though.
    if (this.isLoggedOn) {
      this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOn, LoginState.LoggedOff));
    }
  }

  public login(email: string, password: string) : Promise<boolean> {
    return this.loginApi.mutate({
      email,
      password
    }).toPromise().then(result => {
      return this.setToken(result.data.login)
                 .then(_ => true)
                 .catch(_ => false);
    }).catch(error => {
      this.clearClientState();
      this._log(LogSeverity.UserNotification, "Login failed. Please check your username and password and try again or try the password reset link. See the log for detailed error messages.");
      this._log(LogSeverity.Error, error);
      return false;
    });
  }

  public setToken(token: string) : Promise<boolean> {
    return this.verifySessionApi.mutate({
      token
    }).toPromise()
      .then(result => {
        if (!result.data.verifySession) {
          this.clientState.delete(this.TokenKey);
          this.clientState.delete(this.ProfileKey);
          return false;
        }
        this.clientState.set(this.TokenKey, token);
        this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOff, LoginState.LoggedOn));
        return true;
      })
      .catch(error => {
        this.clearClientState();
        this._log(LogSeverity.UserNotification, "Login failed. Please check your username and password and try again or use the password reset link. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return false;
      });
  }

  public setSessionProfile(profileId:string) : Promise<boolean> {
    return this.setSessionProfileApi.mutate({
      token: this.token,
      profileId: profileId
    })
      .toPromise()
      .then(result => {
        const oldProfileId = this.profileId;
        this.clientState.set(this.ProfileKey, result.data.setSessionProfile);
        this.actionDispatcher.dispatch(new SessionProfileChanged(oldProfileId, result.data.setSessionProfile));
        return true;
      })
      .catch(error => {
        this._log(LogSeverity.UserNotification, "Couldn't set the session profile. Please check your username and password and try again or use the password reset link. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return false;
      });
  }

  public logout() : Promise<boolean> {
    let promsie = this.logoutApi.mutate({token:this.token})
      .toPromise().then(result => {
        console.clear();
        if (!result.data.logout) {
          throw new Error("An unexpected error occurred during logout.");
        }
        return true;
      }).catch(error => {
        console.clear();
        this._log(LogSeverity.UserNotification, "The logout failed. Please try it again in a moment. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return false;
      });

    this.clearClientState();
    return promsie;
  }
}
