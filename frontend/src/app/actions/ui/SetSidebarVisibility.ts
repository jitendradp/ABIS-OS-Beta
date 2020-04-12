import {IAction} from "../IAction";

export type SidebarSide = "right" | "left" | "middle" | "bottom";
export type VisibilityState = "visible" | "invisible" | "toggle";
/* todo elevation state to show or hide it? For more information see material design documentation */
export type Elevation = "base" | "level1";

export class SetSidebarVisibility implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarVisibility";
  name: string = SetSidebarVisibility.Name;

  side: SidebarSide;
  state: VisibilityState;
  elevation: Elevation;

  constructor(
    side: SidebarSide,
    state: VisibilityState,
    elevation: Elevation
  ) {
    this.side = side;
    this.state = state;
    this.elevation = elevation;
  }
}
