import {Service} from "./Service";
import {Entry, prisma} from "../generated";
import {EntryMutations} from "../mutations/entry";

export class SignupService extends Service {

    private channelList: [{ channelId: string }] = <any>[];


    constructor(serviceId:string) {
        super(serviceId);
    }

    get name(): string {
        return "SignupService";
    }

    public async newChannel(channelId: string) {
        console.log(`A new channel (id:${channelId}) to SignupService ${this.serviceId} was created.`);

        this.channelList.push({
            channelId: channelId
        });

        // Whenever a new channel to this service was created, post an entry with all options, the service provides.
        let contentEncoding = (await prisma.contentEncodings({where:{name:"Signup"}}))[0];
        const entry = await EntryMutations.createEntryInGroup(channelId, {
            owner: this.serviceId,
            createdBy: this.serviceId,
            type: "Empty",
            name: "Welcome message",
            contentEncoding:contentEncoding.id
        });

        Service.pubsub.publish("SignupService.newChannel", {
            id: entry.id,
            name: entry.name
        });
    }

    public async newEntry(groupId: string, entry: Entry): Promise<void> {
        console.log("SignupService received new entry:", entry);
    }
}
