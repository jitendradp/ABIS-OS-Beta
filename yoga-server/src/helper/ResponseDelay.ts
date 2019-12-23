export class ResponseDelay {
    private _delay:number;
    private _start:Date;

    constructor(delay) {
        this._delay = delay;
        this._start = new Date();
    }

    public GetPromise() : Promise<void> {
        let end = new Date();
        let dur = Math.abs(end.getTime() - this._start.getTime());
        let wait = this._delay - dur;
        if (wait <= 0) {
            return new Promise<void>(resolve => resolve());
        }
        return new Promise(resolve => setTimeout(resolve, wait));
    }
}
