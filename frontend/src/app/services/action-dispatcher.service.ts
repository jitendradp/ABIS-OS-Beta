import {EventEmitter, Injectable} from '@angular/core';
import {IEvent} from "../actions/IEvent";

@Injectable({
  providedIn: 'root'
})
export class ActionDispatcherService {

  constructor() { }

  public onAction:EventEmitter<IEvent> = new EventEmitter<IEvent>();
  public dispatch(action:IEvent) {
    console.log("["  + new Date().toTimeString() + "] Sending Action:", action);
    this.onAction.emit(action);
  }
}
