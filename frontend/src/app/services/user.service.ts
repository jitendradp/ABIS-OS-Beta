import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginState, LoginStateChanged} from "../actions/user/LoginStateChanged";
import {
  GetAccountInformationGQL,
  LoginGQL,
  LogoutGQL,
  SetSessionProfileGQL,
  VerifySessionGQL,
  AccountInformation
} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {SessionProfileChanged} from "../actions/user/SessionProfileChanged";
import {Apollo} from "apollo-angular";
import {AccountInformationChanged} from "../actions/user/AccountInformationChanged";

export type UserInformation = {
  id: number,
  createdAt: string,
  email: string,
  firstname: string,
  lastname: string,
  mobile_phone: string,
};


@Injectable({
  providedIn: 'root'
})

export class UserService {
  // TODO: Remove the cast to <any> and adopt the UI to the proper AccountInformation type.
  // TODO: Remove the "name" field from the graphql schema and replace it with "firstname" and "lastname"
  public accountInformation: AccountInformation = <any>{
    id: 8989893943,
    createdAt: new Date().toISOString(),
    email: "tomcook@gmail.com",
    firstname: "Thomas",
    lastname: "Cook",
    name: "Thomas Cook",
    mobile_phone: "01777 78787823"
  };

  private readonly _log: Logger = this.loggerService.createLogger("UserService");

  public get csrfToken(): string {
    return this.clientState.get<string>(this.CsrfTokenKey, null).data;
  }

  private readonly CsrfTokenKey = "UserService.csrfToken";

  public get profileId(): string {
    return this.clientState.get<string>(this.ProfileKey, null).data;
  }

  private readonly ProfileKey = "UserService.profileId";

  public get isLoggedOn(): boolean {
    return this._isLoggedOn;
  }

  private _isLoggedOn: boolean;

  constructor(private actionDispatcher: ActionDispatcherService
    , private loggerService: LoggerService
    , private loginApi: LoginGQL
    , private logoutApi: LogoutGQL
    , private setSessionProfileApi: SetSessionProfileGQL
    , private verifySessionApi: VerifySessionGQL
    , private getAccountInformationApi: GetAccountInformationGQL
    , private clientState: ClientStateService
    , private apollo: Apollo) {

    // TODO: this seems to be a bit hacky, does the service really need to subscribe to its own events to know that?
    this.actionDispatcher.onAction.subscribe(action => {
      if (action instanceof LoginStateChanged) {
        this._isLoggedOn = action.newValue == 1;
      }
    });

    // If we have a stored csrfToken from a previous session, try to initialize the UserService
    if (this.csrfToken) {
      this.setToken(this.csrfToken)
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
    this.clientState.delete(this.CsrfTokenKey);

    const oldProfileId = this.profileId;
    this.clientState.delete(this.ProfileKey);
    if (oldProfileId) {
      this.actionDispatcher.dispatch(new SessionProfileChanged(oldProfileId, null));
    }

    // If a account was logged on and the client state of the UserService is cleared, then notify everybody that the account was logged-off.
    // The server session might be still alive though.
    if (this.isLoggedOn) {
      this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOn, LoginState.LoggedOff));
    }
  }

  public login(email: string, password: string): Promise<boolean> {
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

  public setToken(csrfToken: string): Promise<boolean> {
    return this.verifySessionApi.mutate({
      csrfToken: csrfToken
    }).toPromise()
      .then(result => {
        if (!result.data.verifySession) {
          this.clientState.delete(this.CsrfTokenKey);
          this.clientState.delete(this.ProfileKey);
          return false;
        }
        this.clientState.set(this.CsrfTokenKey, csrfToken);
        this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOff, LoginState.LoggedOn));

        this.loadUserInformation()
          .then(accInfo => true)
          .catch(error => {
            this._log(LogSeverity.UserNotification, "An error occurred while loading the account information. See the log for detailed error messages.");
            this._log(LogSeverity.Error, error);
          });

        return true;
      })
      .catch(error => {
        this.clearClientState();
        this._log(LogSeverity.UserNotification, "Login failed. Please check your username and password and try again or use the password reset link. See the log for detailed error messages.");
        this._log(LogSeverity.Error, error);
        return false;
      });
  }

  public async loadUserInformation(): Promise<AccountInformation> {
    const userInfo = await this.getAccountInformationApi.fetch({
      csrfToken: this.csrfToken
    }).toPromise();
    const oldUserInfo = this.accountInformation;
    this.accountInformation = {...userInfo.data.getAccountInformation};
    this.actionDispatcher.dispatch(new AccountInformationChanged(oldUserInfo, this.accountInformation));
    return this.accountInformation;
  }

  public setSessionProfile(profileId: string): Promise<boolean> {
    return this.setSessionProfileApi.mutate({
      csrfToken: this.csrfToken,
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

  public logout(): Promise<boolean> {
    const promise = this.logoutApi.mutate({
      csrfToken: this.csrfToken
    })
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
    return promise;
  }
}
