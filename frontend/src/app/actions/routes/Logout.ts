import {IAction} from "../IAction";

export class Logout implements IAction {
  public static readonly Name: string = "Abis.Routes.Logout";
  name:string = Logout.Name;
}
