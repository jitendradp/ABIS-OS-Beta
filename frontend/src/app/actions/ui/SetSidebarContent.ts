import {Type} from "@angular/core";
import {SidebarSide} from "./SetSidebarVisibility";
import {IEvent} from "../IEvent";

export class SetSidebarContent<T> implements IEvent {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarContent";
  name: string = SetSidebarContent.Name;

  side: SidebarSide;
  component: Type<T>;

  constructor(side:SidebarSide, component: Type<T>) {
    this.side = side;
    this.component = component;
  }
}
