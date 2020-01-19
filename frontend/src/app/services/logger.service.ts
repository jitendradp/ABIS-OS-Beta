import { Injectable } from '@angular/core';
import CircularBuffer from "../../utils/CircularBuffer";
import {ActionDispatcherService} from "./action-dispatcher.service";
import {ShowNotification} from "../actions/ui/ShowNotification";

export enum LogSeverity {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  UserNotification = 100
}

export class LogEntry
{
  timestamp:Date;
  source:string;
  severity:LogSeverity;
  message:string
}

export type Logger = (severity:LogSeverity, message:string) => void;

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private _logger:{[source:string]:CircularBuffer<LogEntry>} = {};

  constructor(private actionDispatcher:ActionDispatcherService) { }

  private log(source:string, severity:LogSeverity, message:string) {
    if (!this._logger[source]) {
      this._logger[source] = new CircularBuffer<LogEntry>(50);
    }

    const logEntry = new LogEntry();
    logEntry.timestamp = new Date();
    logEntry.source = source;
    logEntry.severity = severity;
    logEntry.message = message;

    this._logger[source].enq(logEntry);

    // If it is an error or a user notification, display it to the user
    if (severity == LogSeverity.UserNotification) {
      this.actionDispatcher.dispatch(new ShowNotification(logEntry));
    }
  }

  public createLogger(source:string) : Logger {
    return (severity:LogSeverity, message:string) => this.log(source, severity, message);
  }
}
