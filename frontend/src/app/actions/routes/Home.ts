import {IAction} from "../IAction";

export class Home implements IAction {
  public static readonly Name: string = "Abis.Routes.Home";
  name: string = Home.Name;

  icon:string = "map";
  label:string = "Map";
}
