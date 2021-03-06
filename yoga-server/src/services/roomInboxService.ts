import {Service} from "./service";
import {Topic, Topics} from "./eventBroker";
import {Helper} from "../helper/helper";
import {NewChannel} from "./events/newChannel";
import {NewEntry} from "./events/newEntry";

/**
 * A service representation for a room's inbox.
 */
export class RoomInboxService extends Service {

    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;

    start(): void {
        // The inbox wants to be notified when a new channel to it was created
        // or when a new entry was posted to a group in which the inbox is member.
        this._newChannel = this.server.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        this._newEntry = this.server.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(this.onNewEntry);
    }

    onNewChannel(newChannel:NewChannel) {
        Helper.log(`RoomInboxService received a NewChannel event: ${JSON.stringify(newChannel)}`);
    }

    onNewEntry(newEntry:NewEntry) {
        Helper.log(`RoomInboxService received a NewEntry event: ${JSON.stringify(newEntry)}`);
    }

    stop(): void {
        this.server.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.server.eventBroker.removeTopic(this.id, this._newChannel.name);
    }
}