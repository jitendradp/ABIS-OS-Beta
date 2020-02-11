import {Entry} from "../generated";
import { PubSub} from 'graphql-yoga'

export abstract class Service {

    public static pubsub:PubSub = null;

    public abstract get name():string;

    public readonly serviceId:string;

    constructor(serviceId:string) {
        this.serviceId = serviceId;
    }

    /**
     * Is called whenever a new channel to this service was created.
     * @param channelId
     */
    public abstract newChannel(channelId: string);

    /**
     * Is called whenever a new entry was created in a channel that is monitored by this service.
     * @param groupId
     * @param entry
     */
    public abstract newEntry(groupId:string, entry: Entry): Promise<void>;
}

