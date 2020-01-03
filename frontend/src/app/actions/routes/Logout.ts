import {IEvent} from "../IEvent";

export class Logout implements IEvent {
  public static readonly Name: string = "Abis.Routes.Logout";
  name:string = Logout.Name;
}
