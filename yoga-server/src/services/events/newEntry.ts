import {BaseEvent} from "./event";
import {Entry, EntryType} from "../../generated";

export class NewEntry extends BaseEvent {
    createdIn:string;
    entry: Entry
}