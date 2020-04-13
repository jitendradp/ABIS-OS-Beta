import {Type} from "@angular/core";
import {Elevation, Target} from "./SetVisibility";
import {IEvent} from "../IEvent";

export class SetContent<T> implements IEvent {
  public static readonly Name: string = "Abis.UI.Sidebar.SetContent";
  name: string = SetContent.Name;

  title: string;
  side: Target;
  component: Type<T>;
  elevation:Elevation;
  context?:any;

  constructor(title:string, target:Target, component: Type<T>, elevation:Elevation, context?:any) {
    this.title = title;
    this.side = target;
    this.component = component;
    this.elevation = elevation;
    this.context = context;
  }
}
