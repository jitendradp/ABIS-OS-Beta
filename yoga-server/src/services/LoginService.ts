import {Service} from "./Service";
import {Topic, Topics} from "./EventBroker";
import {Helper} from "../helper/Helper";
import {NewChannel} from "./events/newChannel";
import {NewEntry} from "./events/newEntry";

export class LoginService extends Service {

    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;

    start(): void {
        // The login service wants to be notified when a new channel to it was created
        // or when a new entry was posted to a group in which the service is member.
        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(this.onNewEntry);
    }

    onNewChannel(newChannel:NewChannel) {
        Helper.log(`LoginService received a NewChannel event: ${JSON.stringify(newChannel)}`);
    }

    onNewEntry(newEntry:NewEntry) {
        Helper.log(`LoginService received a NewEntry event: ${JSON.stringify(newEntry)}`);
    }

    stop(): void {
        this.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.eventBroker.removeTopic(this.id, this._newChannel.name);
    }
}