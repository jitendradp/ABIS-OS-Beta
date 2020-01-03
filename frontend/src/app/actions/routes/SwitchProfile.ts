import {IEvent} from "../IEvent";

export class SwitchProfile implements IEvent {
  public static readonly Name: string = "Abis.Routes.SwitchProfile";
  name:string = SwitchProfile.Name;
}
