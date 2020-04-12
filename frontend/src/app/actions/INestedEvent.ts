import {IEvent} from "./IEvent";

export interface INestedEvent extends IEvent {
  events:IEvent[];
}
