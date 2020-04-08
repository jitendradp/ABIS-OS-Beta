import {Entry, EntryCreateInput, Group, prisma} from "../../generated/prisma_client";
import {Helper} from "../../helper/helper";
import {EventBroker, Topics} from "../../services/eventBroker";
import {Channel} from "../../api/types/channel";
import {Init, Server} from "../../init";

export class AgentCreate {

    public static async stash(agentId: string, name: string, logo: string) {
        const agent = await prisma.agent({id: agentId});
        if (!agent) {
            throw new Error(`Couldn't create a Stash. The specified agentId does not exist: ${agentId}.`);
        }
        const existingStash = await prisma.groups({where: {owner: agentId, name: name, type: "Stash"}});
        if (existingStash.length != 0) {
            throw new Error(`Couldn't create a Stash. A Stash with the specified name already exist: ${name}`);
        }

        const newStash = await prisma.createGroup({
            createdBy: agentId,
            owner: agentId,
            type: "Stash",
            name: name,
            logo: logo,
            isPublic: false,
            isMemory: false
        });

        Helper.log(`Created a new stash (${newStash.id}) for agent '${agentId}'.`);

        return newStash;
    }

    /**
     * Creates a new directional channel from one agent to another.
     * @param server The environment
     * @param fromAgentId The owner agent
     * @param toAgentId The receiver agent
     * @param isMemory If the channel should store its entries only in memory
     * @param name The name of the channel
     * @param logo The logo of the channel
     */
    public static async channel(server:Server, fromAgentId: string, toAgentId: string, isMemory:boolean, name: string, logo: string) {
        const fromAgent = await prisma.agent({id: fromAgentId});
        if (!fromAgent) {
            throw new Error(`Couldn't create a Channel from agent '${fromAgentId}' to agent '${toAgentId}'. The specified fromAgentId does not exist.`);
        }
        const toAgent = await prisma.agent({id: toAgentId});
        if (!toAgent) {
            throw new Error(`Couldn't create a Channel from agent '${fromAgentId}' to agent '${toAgentId}'. The specified toAgentId does not exist.`);
        }
        const existingChannel = await prisma.groups({
            where: {
                owner: fromAgentId,
                type: "Channel",
                memberships_some: {
                    member: {
                        id: toAgentId
                    }
                }
            }
        });
        if (existingChannel.length != 0) {
            throw new Error(`Couldn't create a Channel from agent '${fromAgentId}' to agent '${toAgentId}' because it already exists.`);
        }

        const newChannel = await prisma.createGroup({
            createdBy: fromAgentId,
            owner: fromAgentId,
            type: "Channel",
            name: name,
            logo: logo,
            isPublic: false,
            isMemory: isMemory,
            memberships: {
                create: {
                    createdBy: fromAgentId,
                    showHistory: true,
                    type: "Single",
                    member: {
                        connect: {
                            id: toAgentId
                        }
                    }
                }
            }
        });

        Helper.log(`Created a ${isMemory ? "Memory" : ""}Channel from agent '${fromAgentId}' to agent '${toAgentId}'.`);

        // Augment the created channel with its reverse channel (if any)
        const reverseChannel = await prisma.groups({where:{owner: toAgentId, memberships_every:{member:{id:fromAgentId}}}});
        let reverseApiChannel = undefined;

        if (reverseChannel.length > 0) {
             reverseApiChannel = <Channel> {
                 ...reverseChannel[0],
                 receiver: fromAgent,
                 reverse: undefined
             }
        }

        let apiChannel = <Channel> {
            ...newChannel,
            receiver: toAgent,
            reverse: reverseApiChannel
        };

        server.eventBroker
            .getTopic<Channel>("system", Topics.NewChannel)
            .publish(apiChannel);

        return newChannel;
    }

    public static async room(server: Server, agentId: string, name: string, logo: string, isPublic: boolean) {
        const agent = await prisma.agent({id: agentId});
        if (!agent) {
            throw new Error(`Couldn't create a Room. The specified agentId does not exist: ${agentId}`);
        }
        const existingRoom = await prisma.groups({where: {owner: agentId, name: name, type: "Room"}});
        if (existingRoom.length != 0) {
            throw new Error(`Couldn't create a Room. A Room with the specified name already exist: ${name}`);
        }

        const newRoom = await prisma.createGroup({
            createdBy: agentId,
            owner: agentId,
            type: "Room",
            name: name,
            logo: logo,
            isPublic: isPublic,
            isMemory: false
        });

        Helper.log(`Created a new room (${newRoom.id}) with agent '${agentId}' as owner.`);

        await server.eventBroker
            .getTopic<Group>("system", Topics.NewRoom)
            .publish(newRoom);

        return newRoom;
    }

    public static async entry(server: Server, agentId: string, groupId: string, entry: EntryCreateInput, request?:any) : Promise<Entry> {
        entry.createdBy = agentId;
        entry.owner = agentId;

        // TODO: Check if the entry is written to a memory channel. If so, don't create the entry in the db.
        const group = await prisma.group({id: groupId});
        let createdEntry:Entry = null;
        if (group.isMemory) {
            createdEntry = await this.memoryEntry(entry, groupId, server, request);
        } else {
            createdEntry = await this.persistedEntry(entry, groupId, server, request);
        }

        const contentEncoding = server.contentEncodingsIdMap[entry.contentEncoding];
        if (!contentEncoding) {
            throw new Error(`The content encoding with the id '${entry.contentEncoding}' is unknown.`);
        }

        if (contentEncoding) {
            (<any>createdEntry).contentEncoding = { // TODO: Fix cast
                id: contentEncoding.id
            };
        }

        (<any>createdEntry).__request = request; // TODO: Find a better way to set cookies

        // TODO: This can propagate the errors of services to this position
        await server.eventBroker
            .getTopic<Entry>("system", Topics.NewEntry)
            .publish(createdEntry);

        return createdEntry;
    }

    private static async memoryEntry(entry: EntryCreateInput, groupId: string, server: Server, request: any) : Promise<Entry> {
        const memoryPersistedEntry = await server.memoryEntries.store(groupId, entry);
        return memoryPersistedEntry;
    }

    private static async persistedEntry(entry: EntryCreateInput, groupId: string, server: Server, request: any) {
        // TODO: No transactions..
        const persistedEntry = await prisma.createEntry(entry);

        await prisma.updateGroup({
            where: {
                id: groupId
            },
            data: {
                entries: {
                    connect: {
                        id: persistedEntry.id
                    }
                }
            }
        });

        return persistedEntry;
    }

    public static async membership(agentId: string, groupId: string, inviteeAgentId: string) {
        // TODO: Check if the same user has multiple memberships in the same group, if yes change the existing membership to a MultiMembership.
        throw new Error("Not implemented");
    }
}