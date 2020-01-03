import {IEvent} from "../IEvent";
import {LogEntry} from "../../services/logger.service";

export class ShowNotification implements IEvent {
  public static readonly Name: string = "Abis.UI.ShowNotification";
  name:string = ShowNotification.Name;

  logEntry:LogEntry;

  constructor(logEntry:LogEntry) {
    this.logEntry = logEntry;
  }
}
