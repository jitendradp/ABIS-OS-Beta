import {Type} from "@angular/core";
import {Elevation, SidebarSide} from "./SetSidebarVisibility";
import {IEvent} from "../IEvent";

export class SetSidebarContent<T> implements IEvent {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarContent";
  name: string = SetSidebarContent.Name;

  title: string;
  side: SidebarSide;
  component: Type<T>;
  elevation:Elevation;
  context?:any;

  constructor(title:string, side:SidebarSide, component: Type<T>, elevation:Elevation, context?:any) {
    this.title = title;
    this.side = side;
    this.component = component;
    this.elevation = elevation;
    this.context = context;
  }
}
