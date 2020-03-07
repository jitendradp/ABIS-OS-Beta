import {prisma} from "../generated/prisma_client";

export class AgentCanCreate {
    /**
     * Anonymous agents can sign-up and create a user.
     * @param agentId
     * @param email
     */
    public static async user(agentId:string, email:string) {
        throw new Error("Not implemented");
    }

    /**
     * Agents can create as many stashes as they want as long as they're authenticated.
     * Anonymous agents can create max. one stash.
     * @param agentId
     * @param name
     */
    public static async stash(agentId:string, name:string) {
        throw new Error("Not implemented");
    }

    /**
     * All agents can create as many channels to other agents as they want but only one per two agents and direction.
     * @param fromAgentId
     * @param toAgentId
     */
    public static async channel(fromAgentId:string, toAgentId:string) {
        throw new Error("Not implemented");
    }

    /**
     * All authenticated agents can create as many rooms as they want.
     * @param agentId
     * @param roomName
     */
    public static async room(agentId:string, roomName:string) {
        throw new Error("Not implemented");
    }

    /**
     * Agents can post to ..
     * .. stashes - if they own the stash
     * .. channels - if they own the channel
     * .. rooms - if they own the room or if they're member of that room
     * @param agentId
     * @param groupId
     */
    public static async entry(agentId:string, groupId:string) {
        const group = await prisma.group({id:groupId});
        if (!group) {
            return false;
        }

        let canPostTo = false;
        switch (group.type) {
            case "Channel": canPostTo = await AgentCanCreate.entryInChannel(agentId, groupId); break;
            case "Room": canPostTo = await AgentCanCreate.entryInRoom(agentId, groupId); break;
            case "Stash": canPostTo = await AgentCanCreate.entryInStash(agentId, groupId); break;
        }

        return canPostTo;
    }

    private static async entryInStash(agentId:string, stashId:string) {
        const writableStash = await prisma.groups({
            where:{
                id:stashId,
                type: "Stash",
                owner: agentId
            }
        });

        return writableStash.length > 0;
    }

    private static async entryInChannel(agentId:string, channelId:string) {
        const writableChannel = await prisma.groups({
            where:{
                id:channelId,
                type: "Channel",
                owner: agentId
            }
        });

        return writableChannel.length > 0;
    }

    private static async entryInRoom(agentId:string, roomId:string) {
        const writableRoom = await prisma.groups({
            where:{
                id:roomId,
                type: "Room",
                OR:[{
                    memberships_some:{
                        member:{
                            id:agentId
                        }
                    }
                }, {
                    owner:agentId
                }]
            }
        });

        return writableRoom.length > 0;
    }

    /**
     * Agents can create memberships in rooms for other agents as long as they're themselves members or owners
     * of the room they're inviting to.
     * @param agentId
     * @param groupId
     * @param inviteeAgentId (reserved - not checked at the moment)
     */
    public static async membership(agentId:string, groupId:string, inviteeAgentId:string) {
        const groups = await prisma.groups({
            where: {
                id: groupId,
                type: "Room",
                OR: [{
                    memberships_some: {
                        member: {
                            id: agentId
                        }
                    }
                }, {
                    owner: agentId
                }]
            }
        });

        return groups.length == 1;
    }
}