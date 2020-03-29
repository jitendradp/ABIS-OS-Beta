import {Service} from "./service";
import {Topic, Topics} from "./eventBroker";
import {Helper} from "../helper/helper";
import {NewChannel} from "./events/newChannel";
import {NewEntry} from "./events/newEntry";
import {Group} from "../generated/prisma_client";

/**
 * A service representation for a profile.
 */
export class ProfileService extends Service {

    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;
    private _newRoom: Topic<any>;

    start(): void {
        // The profile wants to be notified when a new channel to it was created
        // or when a new entry was posted to a group in which the profile is member.
        this._newChannel = this.server.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        this._newEntry = this.server.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(this.onNewEntry);

        this._newRoom = this.server.eventBroker.createTopic(this.id, Topics.NewRoom);
        this._newRoom.observable.subscribe(this.onNewRoom);
    }

    onNewChannel(newChannel:NewChannel) {
        Helper.log(`ProfileService received a NewChannel event: ${JSON.stringify(newChannel)}`);
    }

    onNewEntry(newEntry:NewEntry) {
        Helper.log(`ProfileService received a NewEntry event: ${JSON.stringify(newEntry)}`);
    }

    onNewRoom(newRoom:Group) {
        Helper.log(`ProfileService received a NewRoom event: ${JSON.stringify(newRoom)}`);
    }

    stop(): void {
        this.server.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.server.eventBroker.removeTopic(this.id, this._newChannel.name);
        this.server.eventBroker.removeTopic(this.id, this._newRoom.name);
    }
}