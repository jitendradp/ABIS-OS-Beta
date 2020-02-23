export abstract class BaseEvent {
    public get createdAt() {
        return this._createdAt;
    }
    private _createdAt = new Date();

    public get createdBy() {
        return this._createdBy;
    }
    private _createdBy:string;

    constructor(createdBy:string) {
        this._createdBy = createdBy;
    }
}