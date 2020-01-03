import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginState, LoginStateChanged} from "../actions/account/LoginStateChanged";
import {LoginGQL, LogoutGQL, SetSessionProfileGQL, VerifySessionGQL} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {SessionProfileChanged} from "../actions/account/SessionProfileChanged";

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

  get token() : string {
    return this.clientState.get<string>("AccountService.token", null).data;
  }

  get profileId() : string {
    return this.clientState.get<string>("AccountService.profileId", null).data;
  }

  constructor(private actionDispatcher:ActionDispatcherService
              , private loggerService:LoggerService
              , private loginApi:LoginGQL
              , private logoutApi:LogoutGQL
              , private setSessionProfileApi:SetSessionProfileGQL
              , private verifySessionApi:VerifySessionGQL
              , private clientState:ClientStateService) {
    let persistedSession = this.token;
    if (persistedSession) {
      this.setToken(persistedSession);
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
      this.clientState.delete("AccountService.token");
      this.clientState.delete("AccountService.profileId");
      this._log(LogSeverity.Error, "Login failed. Please check your username and password and try again or try the password reset link. See the log for detailed error messages.");
      this._log(LogSeverity.Warning, error);
      return false;
    });
  }

  public setToken(token: string) : Promise<void> {
    return this.verifySessionApi.mutate({
      token
    }).toPromise()
      .then(result => {
        if (!result.data.verifySession) {
          this.clientState.delete("AccountService.token");
          this.clientState.delete("AccountService.profileId");
          return;
        }
        this.clientState.set("AccountService.token", token);
        this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOff, LoginState.LoggedOn));
      })
      .catch(error => {
        this.clientState.delete("AccountService.token");
        this.clientState.delete("AccountService.profileId");
        this._log(LogSeverity.Error, "Login failed. Please check your username and password and try again or use the password reset link. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
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
        this.clientState.set("AccountService.profileId", result.data.setSessionProfile);
        this.actionDispatcher.dispatch(new SessionProfileChanged(oldProfileId, result.data.setSessionProfile));
        return true;
      })
      .catch(error => {
        this._log(LogSeverity.Error, "Couldn't set the session profile. Please check your username and password and try again or use the password reset link. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return false;
      });
  }

  public logout() : Promise<boolean> {
    return this.logoutApi.mutate({token:this.token})
      .toPromise().then(result => {
        this.clientState.delete("AccountService.token");
        this.clientState.delete("AccountService.profileId");
        this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOn, LoginState.LoggedOff));
        return true;
      }).catch(error => {
        this._log(LogSeverity.Error, "The logout failed. Please try it again in a moment. See the log for detailed error messages.");
        this._log(LogSeverity.Warning, error);
        return false;
      });
  }
}
