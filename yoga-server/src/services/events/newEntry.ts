import {BaseEvent} from "./event";
import {EntryType} from "../../generated";

export class NewEntry extends BaseEvent {
    createdIn:string;
    id:string;
    contentEncoding:string;
    type:EntryType;
}