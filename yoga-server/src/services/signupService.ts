import {Service} from "./service";
import {EventBroker, Topic, Topics} from "./eventBroker";
import {Helper} from "../helper/helper";
import {AgentCreate} from "../data/mutations/agentCreate";
import {ServerInit} from "../serverInit";
import {Channel} from "../api/types/channel";
import {Agent, Entry, prisma} from "../generated";
var ajv = require('ajv');

export class SignupService extends Service {

    private _newChannel: Topic<any>;
    private _newEntry: Topic<any>;

    constructor(eventBroker:EventBroker, agent:Agent) {
        super(eventBroker, agent);
    }

    start(): void {
        // The signup service wants to be notified when a new channel to it was created
        // or when a new entry was posted to a group in which the service is member.
        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(this.onNewChannel);

        const self = this;
        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(next => this.onNewEntry(next, self));
    }

    stop(): void {
        this.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.eventBroker.removeTopic(this.id, this._newChannel.name);
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
            owner: this.id,
            createdBy: this.id,
            contentEncoding: ServerInit.signupContentEncoding.id,
            content:null,
            name: "Welcome"
        });
    }

    async onNewEntry(newEntry:Entry, context:SignupService) {
        if (newEntry.createdBy == context.id) {
            return;
        }
        Helper.log("Checking if message has content type " + ServerInit.signupContentEncoding.id + " ...");

        // TODO: Fix <any> cast
        if ((<any>newEntry.contentEncoding).id != ServerInit.signupContentEncoding.id) {
            // Unknown entry type
            Helper.log(`SignupService received an entry with an unknown type: ${JSON.stringify(newEntry)}`);
            return;
        }
        const group = await prisma.groups({
            where: {
                entries_some: {
                    id: newEntry.id
                }
            }
        });

        const reverseChannel = await prisma.groups({
            where: {
                type: "Channel",
                owner: context.id,
                memberships_every: {
                    member: {
                        id: newEntry.createdBy
                    }
                }
            }
        });

        if (reverseChannel.length != 1) {
            throw new Error("Couldn't find a reverse channel for entry " + newEntry.id)
        }

        var schema = JSON.parse(ServerInit.signupContentEncoding.data);
        var validate = ajv().compile(schema.Signup);
        var isValid = validate(newEntry.content.Signup);

        if (!isValid) {
            console.log("The provided data is not valid!");
            AgentCreate.entry(reverseChannel[0].owner, reverseChannel[0].id, {
                type: "Json",
                owner: this.id,
                createdBy: this.id,
                contentEncoding: ServerInit.errorContentEncoding.id,
                content:null,
                name: "Validation error"
            });
        } else {
            console.log("The provided data was valid -> proceeding with continuation.");
            AgentCreate.entry(reverseChannel[0].owner, reverseChannel[0].id, {
                type: "Json",
                owner: this.id,
                createdBy: this.id,
                contentEncoding: ServerInit.continuationContentEncoding.id,
                content: {
                    Continuation: {
                        fromAgentId: this.id,
                        toAgentId: ServerInit.verifyEmailService.id,
                        context: null
                    }
                },
                name: "Continuation"
            });
        }
    }
}