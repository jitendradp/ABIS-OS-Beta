import {ChangeAction} from "../ChangeAction";

export enum LoginState {
  LoggedOff = 0,
  LoggedOn = 1
}

export class LoginStateChanged extends ChangeAction<LoginState> {
  public static readonly Name: string = "Abis.Account.LoginsStateChanged";

  constructor(oldValue:LoginState, newValue:LoginState) {
    super(LoginStateChanged.Name, oldValue, newValue);
  }
}
