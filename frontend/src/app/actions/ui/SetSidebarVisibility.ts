import {IAction} from "../IAction";

export type SidebarSide = "right" | "middle" | "left";
export type VisibilityState = "visible" | "invisible" | "toggle";
export type ElevationState = "z1" | "z2";

export class SetSidebarVisibility implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.SetSidebarVisibility";
  name: string = SetSidebarVisibility.Name;

  side: SidebarSide;
  state: VisibilityState;
  elevation: ElevationState;

  constructor(
    side: SidebarSide,
    state: VisibilityState,
    elevation: ElevationState
  ) {
    this.side = side;
    this.state = state;
    this.elevation = elevation;
  }
}
