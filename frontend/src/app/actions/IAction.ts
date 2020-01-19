import {IEvent} from "./IEvent";

export interface IAction extends IEvent {
  icon?: string,
  label?: string,
}
