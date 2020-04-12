import {Type} from "@angular/core";
import {Elevation, SidebarSide} from "./SetSidebarVisibility";
import {IEvent} from "../IEvent";

export class SetSidebarContent<T> implements IEvent {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarContent";
  name: string = SetSidebarContent.Name;

  side: SidebarSide;
  component: Type<T>;
  elevation:Elevation;

  constructor(side:SidebarSide, component: Type<T>, elevation:Elevation) {
    this.side = side;
    this.component = component;
    this.elevation = elevation;
  }
}
