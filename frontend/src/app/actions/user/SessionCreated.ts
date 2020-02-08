import {IEvent} from "../IEvent";

export class SessionCreated implements IEvent {
  public static readonly Name: string = "Abis.User.SessionCreated";
  name: string = SessionCreated.name;

  constructor() {
  }
}
