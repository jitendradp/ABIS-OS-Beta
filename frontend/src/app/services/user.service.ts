import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginState, LoginStateChanged} from "../actions/user/LoginStateChanged";
import {
  SignupGQL,
  LoginGQL,
  MyAccountGQL,
  LogoutGQL,
  VerifySessionGQL,
  Account, UserType
} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {SessionProfileChanged} from "../actions/user/SessionProfileChanged";
import {Apollo} from "apollo-angular";
import {UserInformationChanged} from "../actions/user/UserInformationChanged";

export type UserInformation = {
  id: number,
  createdAt: string,
  email: string,
  firstName: string,
  lastName: string,
  mobilePhone: string,
};


@Injectable({
  providedIn: 'root'
})

export class UserService {
  // TODO: Remove the cast to <any> and adopt the UI to the proper UserInformation type.
  // TODO: Remove the "name" field from the graphql schema and replace it with "firstname" and "lastname"
  public accountInformation: Account = {
    id: "8989893943",
    type: <UserType>"Person",
    timezone: "GMT",
    createdAt: new Date().toISOString(),
    email: "tomcook@gmail.com",
    personFirstName: "Thomas",
    personLastName: "Cook",
    personMobilePhone: "01777 78787823"
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
    , private verifySessionApi: VerifySessionGQL
    , private myAccountApi: MyAccountGQL
    , private signupApi: SignupGQL
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

    // If a user was logged on and the client state of the UserService is cleared, then notify everybody that the user was logged-off.
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
      if (!result.data.login.success) {
        throw new Error("The login attempt was not successful.")
      }
      return this.setToken(result.data.login.data)
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
        if (!result.data.verifySession.success) {
          this.clientState.delete(this.CsrfTokenKey);
          this.clientState.delete(this.ProfileKey);
          return false;
        }
        this.clientState.set(this.CsrfTokenKey, csrfToken);
        this.actionDispatcher.dispatch(new LoginStateChanged(LoginState.LoggedOff, LoginState.LoggedOn));

        this.loadMyAccount()
          .then(accInfo => true)
          .catch(error => {
            this._log(LogSeverity.UserNotification, "An error occurred while loading the user information. See the log for detailed error messages.");
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

  public async loadMyAccount(): Promise<Account> {
    const userInfo = await this.myAccountApi.fetch({
      csrfToken: this.csrfToken
    }).toPromise();
    const oldUserInfo = this.accountInformation;
    this.accountInformation = <Account>userInfo.data.myAccount;
    this.actionDispatcher.dispatch(new UserInformationChanged(oldUserInfo, this.accountInformation));
    return this.accountInformation;
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
