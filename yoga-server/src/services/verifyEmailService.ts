import {Service} from "./service";
import {EventBroker, Topic, Topics} from "./eventBroker";
import {Agent} from "../generated/prisma_client";
import {Helper} from "../helper/helper";
import {Channel} from "../api/types/channel";
import {AgentCreate} from "../data/mutations/agentCreate";
import {ServerInit} from "../serverInit";
import {Entry} from "../generated";

export class VerifyEmailService extends Service {
    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;

    constructor(eventBroker: EventBroker, agent: Agent) {
        super(eventBroker, agent);
    }

    start(): void {
        Helper.log(`VerifyEmailService started.`);

        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        const self = this;
        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(next => this.onNewEntry(next, self));
    }

    stop(): void {
        Helper.log(`VerifyEmailService stopped.`);
    }

    async onNewChannel(newChannel: Channel) {
        Helper.log(`VerifyEmailService received a NewChannel event: ${JSON.stringify(newChannel)}`);

        Helper.log(`Creating a reverse channel from '${newChannel.receiver.id}' to '${newChannel.owner}'.`);
        const reverseChannel = await AgentCreate.channel(
            newChannel.receiver.id,
            newChannel.owner,
            `${newChannel.receiver.id}->${newChannel.owner}`,
            "channel.png");

        Helper.log(`Putting a welcome message into the new channel from '${newChannel.receiver.id}' to '${newChannel.owner}'.`);
        const welcomeEntry = AgentCreate.entry(reverseChannel.owner, reverseChannel.id, {
            type: "Empty",
            owner: this.id,
            createdBy: this.id,
            contentEncoding: ServerInit.verifyEmailContentEncoding.id,
            content:null,
            name: "Welcome"
        });
    }

    async onNewEntry(newEntry:Entry, context:VerifyEmailService) {
        if (newEntry.createdBy == context.id) {
            return;
        }

    }
}