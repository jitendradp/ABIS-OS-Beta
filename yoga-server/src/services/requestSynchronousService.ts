import {DirectService} from "./directService";
import {Topics} from "./eventBroker";

export abstract class RequestSynchronousService extends DirectService {
    start(): void {
        const self = this;

        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(next => this.onNewChannel.call(self, next));

        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.depend(async next => await this.onNewEntryInternal.call(self, next, next.__request));
    }
}