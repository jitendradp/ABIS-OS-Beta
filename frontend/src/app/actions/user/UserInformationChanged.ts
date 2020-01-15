import {ChangeAction} from "../ChangeAction";
import {UserInformation} from "../../../generated/abis-api";

export class UserInformationChanged extends ChangeAction<UserInformation> {
  public static readonly Name: string = "Abis.User.UserInformationChanged";

  constructor(oldValue:UserInformation, newValue:UserInformation) {
    super(UserInformationChanged.Name, oldValue, newValue);
  }
}
