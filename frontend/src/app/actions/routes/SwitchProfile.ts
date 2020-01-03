import {IAction} from "../IAction";

export class SwitchProfile implements IAction {
  public static readonly Name: string = "Abis.Routes.SwitchProfile";
  name:string = SwitchProfile.Name;
}
