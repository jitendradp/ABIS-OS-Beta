import {prisma} from "../../generated";
import {Helper} from "../../helper/Helper";
import {EventBroker, Topics} from "../../services/EventBroker";
import {NewChannel} from "../../services/events/newChannel";

export class AgentCreate {
    public static async stash(agentId:string, name:string, logo:string) {
        const agent = await prisma.agent({id: agentId});
        if (!agent) {
            throw new Error(`Couldn't create a Stash. The specified agentId does not exist: ${agentId}.`);
        }
        const existingStash = await prisma.groups({where:{owner:agentId, name:name, type:"Stash"}});
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

    public static async channel(fromAgentId:string, toAgentId:string, name:string, logo:string) {
        const fromAgent = await prisma.agent({id: fromAgentId});
        if (!fromAgent) {
            throw new Error(`Couldn't create a Channel from agent '${fromAgentId}' to agent '${toAgentId}'. The specified fromAgentId does not exist.`);
        }
        const toAgent = await prisma.agent({id: fromAgentId});
        if (!toAgent) {
            throw new Error(`Couldn't create a Channel from agent '${fromAgentId}' to agent '${toAgentId}'. The specified toAgentId does not exist.`);
        }
        const existingChannel = await prisma.groups({
            where:{
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

        EventBroker.instance
            .getTopic<NewChannel>("system", Topics.NewChannel)
            .publish(new NewChannel(fromAgentId, toAgentId));

        return newChannel;
    }

    public static async room(agentId:string, name:string, logo:string, isPublic:boolean) {
        const agent = await prisma.agent({id: agentId});
        if (!agent) {
            throw new Error(`Couldn't create a Room. The specified agentId does not exist: ${agentId}`);
        }
        const existingRoom = await prisma.groups({where:{owner:agentId, name:name, type:"Room"}});
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
}