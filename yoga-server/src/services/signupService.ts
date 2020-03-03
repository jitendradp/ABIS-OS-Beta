import {Service} from "./service";
import {Topic, Topics} from "./eventBroker";
import {NewChannel} from "./events/newChannel";
import {Helper} from "../helper/helper";
import {NewEntry} from "./events/newEntry";
import {AgentCreate} from "../data/mutations/agentCreate";
import {ServerInit} from "../serverInit";
import {Channel} from "../api/types/channel";

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

    async onNewChannel(newChannel:Channel) {
        Helper.log(`SignupService received a NewChannel event: ${JSON.stringify(newChannel)}`);

        Helper.log(`Creating a reverse channel from '${newChannel.receiver.id}' to '${newChannel.owner}'.`);
        const reverseChannel = await AgentCreate.channel(
            newChannel.receiver.id,
            newChannel.owner,
            `${newChannel.receiver.id}->${newChannel.owner}`,
            "channel.png");

        Helper.log(`Putting a welcome message into the new channel from '${newChannel.receiver.id}' to '${newChannel.owner}'.`);
        const welcomeEntry = AgentCreate.entry(reverseChannel.owner, reverseChannel.id, {
            type: "Empty",
            owner: newChannel.receiver.id,
            createdBy: newChannel.owner,
            contentEncoding: ServerInit.signupContentEncoding.id,
            content:null,
            name: "Welcome"
        });
    }

    onNewEntry(newEntry:NewEntry) {
        Helper.log(`SignupService received a NewEntry event: ${JSON.stringify(newEntry)}`);
    }

    stop(): void {
        this.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.eventBroker.removeTopic(this.id, this._newChannel.name);
    }
}