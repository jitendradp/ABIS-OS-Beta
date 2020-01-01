import {EventEmitter, Injectable} from '@angular/core';
import {IAction} from "../interfaces/IAction";

@Injectable({
  providedIn: 'root'
})
export class ActionDispatcherService {

  constructor() { }

  public onAction:EventEmitter<IAction> = new EventEmitter<IAction>();
  public dispatch(action:IAction) {
    this.onAction.emit(action);
  }
}
