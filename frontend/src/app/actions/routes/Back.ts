import {IAction} from "../IAction";

export class Back implements IAction {
  public static readonly Name: string = "Abis.Routes.Back";

  name: string = Back.Name;
  icon:string = "chevron_left";
  label:string = "Back";
}
