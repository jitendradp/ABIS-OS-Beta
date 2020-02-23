import {BaseEvent} from "./event";

export class NewChannel extends BaseEvent {
    get fromAgentId(): string {
        return this._fromAgentId;
    }
    private _fromAgentId:string;

    get toAgentId(): string {
        return this._toAgentId;
    }
    private _toAgentId:string;

    constructor(fromAgentId:string, toAgentId:string) {
        super(fromAgentId);
        this._fromAgentId = fromAgentId;
        this._toAgentId = toAgentId;
    }

}