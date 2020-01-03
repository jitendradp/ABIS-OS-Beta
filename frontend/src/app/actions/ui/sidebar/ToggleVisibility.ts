import {IAction} from "../../IAction";

export class ToggleVisibility implements IAction {
  public static readonly Name: string = "Abis.UI.Sidebar.ToggleVisibility";
  name:string = ToggleVisibility.Name;

  side:"right"|"left";

  constructor(side:"right"|"left") {
    this.side = side;
  }
}
