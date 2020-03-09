import {Entry, EntryCreateInput, prisma} from "../../generated";
import {Helper} from "../../helper/helper";
import {EventBroker, Topics} from "../../services/eventBroker";
import {Channel} from "../../api/types/channel";

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
        });

        Helper.log(`Created a new stash (${newStash.id}) for agent '${agentId}'.`);

        return newStash;
    }

    public static async channel(fromAgentId: string, toAgentId: string, name: string, logo: string) {
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

        Helper.log(`Created a Channel from agent '${fromAgentId}' to agent '${toAgentId}'.`);

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

        EventBroker.instance
            .getTopic<Channel>("system", Topics.NewChannel)
            .publish(apiChannel);

        return newChannel;
    }

    public static async room(agentId: string, name: string, logo: string, isPublic: boolean) {
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
            isPublic: isPublic
        });

        Helper.log(`Created a new room (${newRoom.id}) with agent '${agentId}' as owner.`);

        return newRoom;
    }

    public static async entry(agentId: string, groupId: string, entry: EntryCreateInput, request?:any) {
        entry.createdBy = agentId;
        entry.owner = agentId;

        await prisma.updateGroup({
            where: {
                id: groupId
            },
            data: {
                entries: {
                    create: entry
                }
            }
        });

        // TODO: Stuff like this will fail miserably when executed in parallel. Find a different way to get the inserted ids.
        const newEntry = await prisma.group({id: groupId}).entries({first: 1, orderBy: "createdAt_DESC"});
        const contentEncoding = await prisma.contentEncoding({id:entry.contentEncoding});

        if (contentEncoding) {
            (<any> newEntry[0]).contentEncoding = { // TODO: Fix cast
                id: contentEncoding.id
            };
        }

        (<any>newEntry[0]).__request = request; // TODO: Find a better way to set cookies

        // TODO: This can propagate the errors of services to this position
        await EventBroker.instance
            .getTopic<Entry>("system", Topics.NewEntry)
            .publish(newEntry[0]);

        return newEntry[0];
    }

    public static async membership(agentId: string, groupId: string, inviteeAgentId: string) {
        // TODO: Check if the same user has multiple memberships in the same group, if yes change the existing membership to a MultiMembership.
        throw new Error("Not implemented");
    }
}