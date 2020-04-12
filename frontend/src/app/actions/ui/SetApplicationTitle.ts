import {IEvent} from "../IEvent";

export class SetApplicationTitle implements IEvent {
  name: string = SetApplicationTitle.Name;
  public static readonly Name: string = "Abis.UI.SetApplicationTitle";

  title:string;

  constructor(title:string) {
    this.title = title;
  }
}
