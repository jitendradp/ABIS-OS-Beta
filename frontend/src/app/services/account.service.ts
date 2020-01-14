import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginState, LoginStateChanged} from "../actions/account/LoginStateChanged";
import {
  AccountInformation,
  GetAccountInformationGQL,
  LoginGQL,
  LogoutGQL,
  SetSessionProfileGQL,
  VerifySessionGQL
} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {SessionProfileChanged} from "../actions/account/SessionProfileChanged";
import {Apollo} from "apollo-angular";
import {AccountInformationChanged} from "../actions/account/AccountInformationChanged";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountInformation: AccountInformation = <any>{
    id: "hello world",
    createdAt: new Date().toISOString(),
    email: "jess88@gmail.com",
    firstname: "Jesscia",
    lastname: "Cohen"
  };

  private readonly _log: Logger = this.loggerService.createLogger("AccountService");

  public get csrfToken(): string {
    return this.clientState.get<string>(this.CsrfTokenKey, null).data;
  }

  private readonly CsrfTokenKey = "AccountService.csrfToken";

  public get profileId(): string {
    return this.clientState.get<string>(this.ProfileKey, null).data;
  }

  private readonly ProfileKey = "AccountService.profileId";

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

    // If we have a stored csrfToken from a previous session, try to initialize the AccountService
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

    // If a user was logged on and the client state of the AccountService is cleared, then notify everybody that the user was logged-off.
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

        this.loadAccountInformation()
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

  public async loadAccountInformation(): Promise<AccountInformation> {
    const accountInfo = await this.getAccountInformationApi.fetch({
      csrfToken: this.csrfToken
    }).toPromise();
    const oldAccountInfo = this.accountInformation;
    this.accountInformation = {...accountInfo.data.getAccountInformation};
    this.actionDispatcher.dispatch(new AccountInformationChanged(oldAccountInfo, this.accountInformation));
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
    const promsie = this.logoutApi.mutate({
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
    return promsie;
  }
}
