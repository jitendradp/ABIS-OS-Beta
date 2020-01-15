import {ChangeAction} from "../ChangeAction";

export class SessionProfileChanged extends ChangeAction<string> {
  public static readonly Name: string = "Abis.User.SessionProfileChanged";

  constructor(oldValue:string, newValue:string) {
    super(SessionProfileChanged.Name, oldValue, newValue);
  }
}
