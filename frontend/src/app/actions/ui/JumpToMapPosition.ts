import {IEvent} from "../IEvent";

export class JumpToMapPosition implements IEvent {
  name: string = JumpToMapPosition.Name;
  public static readonly Name: string = "Abis.UI.JumpToMapPosition";

  latlng:any;

  constructor(latlng:any) {
    this.latlng = latlng;
  }
}
