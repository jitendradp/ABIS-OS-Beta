import {Service} from "./Service";
import {Topic, Topics} from "./EventBroker";
import {NewChannel} from "./events/newChannel";
import {Helper} from "../helper/Helper";
import {NewEntry} from "./events/newEntry";
import {AgentPostTo} from "../data/mutations/agentPostTo";
import {AgentCreate} from "../data/mutations/agentCreate";
import {prisma} from "../generated";
import {ServerInit} from "../serverInit";

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

    async onNewChannel(newChannel:NewChannel) {
        Helper.log(`SignupService received a NewChannel event: ${JSON.stringify(newChannel)}`);

        Helper.log(`Creating a reverse channel from '${newChannel.toAgentId}' to '${newChannel.fromAgentId}'.`);
        const reverseChannel = await AgentCreate.channel(
            newChannel.toAgentId,
            newChannel.fromAgentId,
            `${newChannel.toAgentId}->${newChannel.fromAgentId}`,
            "channel.png");

        Helper.log(`Putting a welcome message into the new channel from '${newChannel.toAgentId}' to '${newChannel.fromAgentId}'.`);

        const entry = await AgentPostTo.channel(newChannel.toAgentId, reverseChannel.id, {
            type: "Empty",
            owner: newChannel.toAgentId,
            createdBy: newChannel.toAgentId,
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