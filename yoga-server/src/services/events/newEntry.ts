import {BaseEvent} from "./event";
import {Entry} from "../../generated";

export class NewEntry extends BaseEvent {
    createdIn:string;
    entry: Entry
}