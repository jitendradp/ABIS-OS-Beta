import {IAction} from "../../IAction";

export type SidebarSide = "right"|"left";
export type VisibilityState = "visible"|"invisible"|"toggle";

export class SetVisibility implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.SetVisibility";
  name:string = SetVisibility.Name;

  side:SidebarSide;
  state:VisibilityState;

  constructor(side:SidebarSide, state:VisibilityState) {
    this.side = side;
    this.state = state;
  }
}
