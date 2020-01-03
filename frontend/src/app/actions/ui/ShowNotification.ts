import {IAction} from "../IAction";
import {LogEntry} from "../../services/logger.service";

export class ShowNotification implements IAction {
  public static readonly Name: string = "Abis.UI.ShowNotification";
  name:string = ShowNotification.Name;

  logEntry:LogEntry;

  constructor(logEntry:LogEntry) {
    this.logEntry = logEntry;
  }
}
