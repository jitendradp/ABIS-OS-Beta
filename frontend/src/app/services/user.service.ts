import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginStateChanged} from "../actions/user/LoginStateChanged";
import {
  MyAccountGQL,
  Account, UserType, CreateeSessionGQL
} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService, LogSeverity} from "./logger.service";
import {map} from "rxjs/operators";
import {Apollo} from "apollo-angular";
import {UserInformationChanged} from "../actions/user/UserInformationChanged";
import {SessionCreated} from "../actions/user/SessionCreated";
import {Observable} from "rxjs";

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
    , private createSessionApi: CreateeSessionGQL
    , private loggerService: LoggerService
    , private myAccountApi: MyAccountGQL
    , private clientState: ClientStateService
    , private apollo: Apollo) {

    // TODO: this seems to be a bit hacky, does the service really need to subscribe to its own events to know that?
    this.actionDispatcher.onAction.subscribe(action => {
      if (action instanceof LoginStateChanged) {
        this._isLoggedOn = action.newValue == 1;
      }
    });
  }

  public createSession() : Observable<SessionCreated> {
      return this.createSessionApi.mutate({clientTime:new Date().toISOString()}).pipe(
        map(result => {
          console.log(result);
          if (result.data.createSession.success) {
            this.clientState.set(this.CsrfTokenKey, result.data.createSession.code);
            return new SessionCreated();
          } else {
            throw new Error("An error occurred during the session creation.")
          }
        }));
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
}
