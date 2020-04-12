import {IAction} from "../IAction";
import {Type} from "@angular/core";
import {SidebarSide} from "./SetSidebarVisibility";

export class SetSidebarContent<T> implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarContent";
  name: string = SetSidebarContent.Name;

  side: SidebarSide;
  component: Type<T>;

  icon: string;
  label: string;

  constructor(side:SidebarSide, component: Type<T>, icon:string, label:string) {
    this.side = side;
    this.component = component;
    this.icon = icon;
    this.label = label;
  }
}
