import {IAction} from "../IAction";

export class Detail implements IAction {
  public static readonly Name: string = "Abis.Routes.Detail";
  name: string = Detail.Name;

  icon:string = "";
  label:string = "Detail";
}
