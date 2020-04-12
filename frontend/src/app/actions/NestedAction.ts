import {INestedEvent} from "./INestedEvent";
import {IAction} from "./IAction";
import {IEvent} from "./IEvent";

export class NestedAction implements INestedEvent, IAction{
  public static readonly Name: string = "Abis.UI.NestedAction";
  events: IEvent[];
  name: string = NestedAction.Name;
  icon:string;
  label:string;

  constructor(icon:string, label:string, events:IEvent[]) {
    this.icon = icon;
    this.label = label;
    this.events = events;
  }
}
