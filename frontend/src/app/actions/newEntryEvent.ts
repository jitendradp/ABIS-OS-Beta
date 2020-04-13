import {IEvent} from "./IEvent";

export class NewEntryEvent implements IEvent{
  public static readonly Name: string = "Abis.NewEntryEvent";
  name:string = NewEntryEvent.Name;

  entry:any;

  constructor(entry:any) {
    this.entry = entry;
  }
}
