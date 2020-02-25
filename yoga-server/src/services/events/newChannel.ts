import {BaseEvent} from "./event";

export class NewChannel extends BaseEvent {
    fromAgentId:string;
    toAgentId:string;
}