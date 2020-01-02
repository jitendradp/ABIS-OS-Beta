import {IAction} from "./IAction";

export interface IChangeAction<T> extends IAction {
  oldValue:T;
  newValue:T;
}
