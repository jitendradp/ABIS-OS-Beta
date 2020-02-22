import {Service} from "./Service";
import {Topic, Topics} from "./EventBroker";

export class SignupService extends Service {

    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;

    start(): void {
        // The signup service wants to be notified when a new channel to it was created
        // or when a new entry was posted to a group in which the service is member.
        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(this.onNewEntry);
    }

    onNewChannel(value:any) {
    }

    onNewEntry(value:any) {
    }

    stop(): void {
        this.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.eventBroker.removeTopic(this.id, this._newChannel.name);
    }
}