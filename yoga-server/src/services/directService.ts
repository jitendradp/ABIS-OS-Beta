import {Service} from "./service";
import {Topic, Topics} from "./eventBroker";
import {Channel} from "../api/types/channel";
import {Helper} from "../helper/helper";
import {AgentCreate} from "../data/mutations/agentCreate";
import {Entry, Group, prisma} from "../generated";
import {Init} from "../init";

/**
 * This service waits for incoming channels from other agents
 * and responds with a reverse channel and a welcome message whenever it receives one.
 */
export abstract class DirectService extends Service {
    protected _newChannel: Topic<any>;
    protected  _newEntry: Topic<any>;

    start(): void {
        const self = this;

        this._newChannel = this.eventBroker.createTopic(this.id, Topics.NewChannel);
        this._newChannel.observable.subscribe(next => this.onNewChannel.call(self, next));

        this._newEntry = this.eventBroker.createTopic(this.id, Topics.NewEntry);
        this._newEntry.observable.subscribe(next => this.onNewEntryInternal.call(self, next, next.__request));
    }

    stop(): void {
        this.eventBroker.removeTopic(this.id, this._newEntry.name);
        this.eventBroker.removeTopic(this.id, this._newChannel.name);
    }

    /**
     * Must be overridden by inheriting classes and returns the ID of the contentEncoding that should
     * be used for the beginning of the dialog.
     */
    abstract get welcomeMessageContentEncodingId() : string;

    /**
     * Must be overridden by inheriting classes and handles incoming messages from the other party.
     * @param newEntry The new entry from the request channel
     * @param answerChannel The reverse channel that must be used to answer to the request
     * @param request Some entries can contain a __request property. This is its value if it exists.
     */
    abstract async onNewEntry(newEntry:Entry, answerChannel:Group, request?:any);

    /**
     * Handles new channels and responds with a reverse-channel and a welcome message.
     * @param newChannel
     */
    protected async onNewChannel(newChannel:Channel) {
        Helper.log(`${this.name} (${this.id}): received a NewChannel event from '${newChannel.owner}'. Content: ${JSON.stringify(newChannel)}`);
        Helper.log(`${this.name} (${this.id}): establishing a reverse channel ..`);

        const reverseChannel = await AgentCreate.channel(
            this.id,
            newChannel.owner,
            `${this.id}->${newChannel.owner}`,
            "channel.png");

        Helper.log(`${this.name} (${this.id}): reverse channel created. Id: ${reverseChannel.id}`);
        Helper.log(`${this.name} (${this.id}): posting welcome message ..`);

        const welcomeEntry = await AgentCreate.entry(reverseChannel.owner, reverseChannel.id, {
            type: "Empty",
            owner: this.id,
            createdBy: this.id,
            contentEncoding: this.welcomeMessageContentEncodingId,
            content:null,
            name: "Welcome"
        });

        Helper.log(`${this.name} (${this.id}): posted welcome message ${welcomeEntry.id} to agent '${newChannel.owner}' via channel '${reverseChannel.id}'.`);
    }

    protected async onNewEntryInternal(next: Entry, request?:any) {
        if (next.createdBy == this.id) {
            // We don't want to handle messages that have been created by us
            return;
        }

        //
        // Validate the contentType and schema
        //
        var entryContentEncodingId = (<any>next.contentEncoding).id; // TODO: Fix <any> cast
        if (entryContentEncodingId != this.welcomeMessageContentEncodingId) {
            throw new Error(`${this.name} received an entry with an unknown type: ${entryContentEncodingId}`);
        }

        // Find the corresponding answer channel for this entry
        const reverseChannel = await prisma.groups({
            where: {
                type: "Channel",
                owner: this.id,
                memberships_every: {
                    member: {
                        id: next.createdBy
                    }
                }
            }
        });

        if (reverseChannel.length != 1) {
            throw new Error(`No answer channel exists to handle entry '${next.id}'.`);
        }

        let validationErrors = this.validateEntry(next);
        if (validationErrors.length > 0) {
            const summary = "Some of the provided data was invalid. Please correct the data and re-send the form.";
            await this.postError(summary, validationErrors, reverseChannel[0].id);
            return;
        }

        let rc = reverseChannel.length == 1 ? reverseChannel[0] : null;

        await this.onNewEntry(next, rc, request);
    }

    protected postContinueTo(agentId:string, inChannelId:string, context?:any) {
        return AgentCreate.entry(this.id, inChannelId, {
            type: "Json",
            owner: this.id,
            createdBy: this.id,
            contentEncoding: Init.continuationContentEncoding.id,
            content: {
                Continuation: {
                    fromAgentId: this.id,
                    toAgentId: agentId,
                    context: context
                }
            },
            name: "Continuation"
        });
    }

    protected postError(summary:string, validationErrors:{key:string,value:string}[], inChannelId:string) {
        return AgentCreate.entry(this.id, inChannelId, {
            type: "Json",
            owner: this.id,
            createdBy: this.id,
            contentEncoding: Init.errorContentEncoding.id,
            content: {
                summary: summary,
                detail: validationErrors
            },
            name: "Validation error"
        });
    }
}