import {BaseEvent} from "./event";

export class NewEntry extends BaseEvent {
    get contentEncoding(): string {
        return this._contentEncoding;
    }
    get entryId(): string {
        return this._entryId;
    }
    get groupId(): string {
        return this._groupId;
    }
    get ownerId(): string {
        return this._ownerId;
    }
    private _ownerId:string;
    private _groupId:string;
    private _entryId:string;
    private _contentEncoding:string;

    constructor(ownerId:string, groupId:string, entryId:string, contentEncoding:string) {
        super();

        this._ownerId = ownerId;
        this._groupId = groupId;
        this._entryId = entryId;
        this._contentEncoding = contentEncoding;
    }
}