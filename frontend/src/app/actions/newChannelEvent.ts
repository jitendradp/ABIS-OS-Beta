import {IEvent} from "./IEvent";

export class NewChannelEvent implements IEvent{
  public static readonly Name: string = "Abis.NewChannelEvent";
  name:string = NewChannelEvent.Name;

  channel:any;

  constructor(channel:any) {
    this.channel = channel;
  }
}
