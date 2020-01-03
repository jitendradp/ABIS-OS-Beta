import {IEvent} from "./IEvent";

export interface IChangeAction<T> extends IEvent {
  oldValue:T;
  newValue:T;
}
