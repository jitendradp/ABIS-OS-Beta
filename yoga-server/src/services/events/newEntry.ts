import {BaseEvent} from "./event";
import {Entry, EntryType} from "../../generated/prisma_client";

export class NewEntry extends BaseEvent {
    createdIn:string;
    entry: Entry
}