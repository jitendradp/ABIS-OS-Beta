import {IEvent} from "../IEvent";

export class Back implements IEvent {
  public static readonly Name: string = "Abis.Routes.Back";
  name: string = Back.Name;
}
