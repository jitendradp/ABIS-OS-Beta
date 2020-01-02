import {EventEmitter, Injectable} from '@angular/core';
import {IAction} from "../actions/IAction";

@Injectable({
  providedIn: 'root'
})
export class ActionDispatcherService {

  constructor() { }

  public onAction:EventEmitter<IAction> = new EventEmitter<IAction>();
  public dispatch(action:IAction) {
    console.log("["  + new Date().toTimeString() + "] Sending Action:", action);
    this.onAction.emit(action);
  }
}
