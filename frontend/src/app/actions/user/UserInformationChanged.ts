import {ChangeAction} from "../ChangeAction";
import {Account} from "../../../generated/abis-api";

export class UserInformationChanged extends ChangeAction<Account> {
  public static readonly Name: string = "Abis.User.UserInformationChanged";

  constructor(oldValue: Account, newValue: Account) {
    super(UserInformationChanged.Name, oldValue, newValue);
  }
}
