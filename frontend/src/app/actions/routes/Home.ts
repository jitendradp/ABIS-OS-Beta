import {IEvent} from "../IEvent";

export class Home implements IEvent {
  public static readonly Name: string = "Abis.Routes.Home";
  name:string = Home.Name;
}
