import {IEvent} from "../IEvent";

export class JumpToMapPosition implements IEvent {
  name: string = JumpToMapPosition.Name;
  public static readonly Name: string = "Abis.UI.JumpToMapPosition";

  groupId?:string;
  latlng:any;

  constructor(latlng:any, groupId?:string) {
    this.latlng = latlng;
    this.groupId = groupId;
  }
}
