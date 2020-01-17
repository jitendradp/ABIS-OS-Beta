import {ChangeAction} from "../ChangeAction";
import {AccountInformation} from "../../../generated/abis-api";

export class AccountInformationChanged extends ChangeAction<AccountInformation> {
  public static readonly Name: string = "Abis.User.AccountInformationChanged";

  constructor(oldValue: AccountInformation, newValue: AccountInformation) {
    super(AccountInformationChanged.Name, oldValue, newValue);
  }
}
