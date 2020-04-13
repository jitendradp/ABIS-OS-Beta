import {IEvent} from "./IEvent";

export class NewTagEvent implements IEvent{
  public static readonly Name: string = "Abis.NewTagEvent";
  name:string = NewTagEvent.Name;

  tag:any;

  constructor(tag:any) {
    this.tag = tag;
  }
}
