import {Service} from "./Service";
import {Entry, prisma} from "../generated";
import {EntryMutations} from "../mutations/entry";
import {ChannelApiMutations} from "../api/mutations/channelApiMutations";

export class LoginService extends Service {

    private channelList: [{ channelId: string }] = <any>[];


    constructor(serviceId:string) {
        super(serviceId);
    }

    get name(): string {
        return "LoginService";
    }

    public async newChannel(channelId: string) {
        console.log(`A new channel (id:${channelId}) to LoginService ${this.serviceId} was created. Creating a reverse channel ..`);

        let channel = await prisma.group({id:channelId});
        let reverseChannel = await ChannelApiMutations.createChannelInternal(this.serviceId, channel.owner);

        console.log("Created a reverse channel: " + (<any>reverseChannel).id);

        this.channelList.push({
            channelId: channelId
        });

        // Whenever a new channel to this service was created, post an entry with all options, the service provides.
        let contentEncoding = (await prisma.contentEncodings({where:{name:"Login"}}));
        const entry = await EntryMutations.createEntryInGroup(channelId, {
            owner: this.serviceId,
            createdBy: this.serviceId,
            type: "Empty",
            name: "Welcome message",
            contentEncoding:contentEncoding[0].id
        });

        Service.pubsub.publish("LoginService.newChannel", {
            id: entry.id,
            name: entry.name
        });
    }

    public async newEntry(groupId: string, entry: Entry): Promise<void> {
        console.log("LoginService received new entry:", entry);
    }
}
