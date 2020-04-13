import {IAction} from "../IAction";

export type Target = "right" | "left" | "middle" | "bottom" | "dialog";
export type VisibilityState = "visible" | "invisible" | "toggle";
/* todo elevation state to show or hide it? For more information see material design documentation */
export type Elevation = "base" | "level1";

export class SetVisibility implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.SetVisibility";
  name: string = SetVisibility.Name;

  side: Target;
  state: VisibilityState;
  elevation: Elevation;

  constructor(
    side: Target,
    state: VisibilityState,
    elevation: Elevation
  ) {
    this.side = side;
    this.state = state;
    this.elevation = elevation;
  }
}
