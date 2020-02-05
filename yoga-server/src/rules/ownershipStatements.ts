import {prisma} from "../generated";

export class OwnershipStatements {
    /**
     * Determines if a User owns an Agent.
     * @param userId The user id
     * @param agentId The agent id
     */
    public static async userOwnsProfile(userId:string, agentId:string) : Promise<boolean> {
        const userAgent = await prisma.user({id:userId})
                                      .agents({where:{id:agentId, type:"Profile"}});
        if (userAgent.length != 1) {
            return false;
        }
        return userAgent[0].owner == userId;
    }

    /**
     * Determines if an Agent owns a Group
     * @param agentId The agent id
     * @param groupId The group id
     */
    public static async agentOwnsGroup(agentId:string, groupId:string) : Promise<boolean> {
        const ownedGroups = await prisma.groups({where:{id: groupId, owner:agentId}});
        if (ownedGroups.length != 1) {
            return false;
        }
        return ownedGroups[0].owner == agentId;
    }

    /**
     * Determines if an Agent owns a StashMutations
     * @param agentId The agent id
     * @param stashId The stash id
     */
    public static async agentOwnsStash(agentId:string, stashId:string) : Promise<boolean> {
        const ownedStash = await prisma.groups({where:{type: "Stash", id: stashId, owner:agentId}});
        if (ownedStash.length != 1) {
            return false;
        }
        return ownedStash[0].owner == agentId;
    }

    /**
     * Determines if an Agent owns a Channel
     * @param agentId The agent id
     * @param channelId The channel id
     */
    public static async agentOwnsChannel(agentId:string, channelId:string) : Promise<boolean> {
        const ownedChannel = await prisma.groups({where:{type: "Channel", id: channelId, owner:agentId}});
        if (ownedChannel.length != 1) {
            return false;
        }
        return ownedChannel[0].owner == agentId;
    }

    /**
     * Determines if an Agent owns a Room
     * @param agentId The agent id
     * @param roomId The room id
     */
    public static async agentOwnsRoom(agentId:string, roomId:string) : Promise<boolean> {
        const ownedRoom = await prisma.groups({where:{type: "Room", id: roomId, owner:agentId}});
        if (ownedRoom.length != 1) {
            return false;
        }
        return ownedRoom[0].owner == agentId;
    }

    /**
     * Determines if an Agent owns an Entry
     * @param agentId The agent id
     * @param entryId The entry id
     */
    public static async agentOwnsEntry(agentId:string, entryId:string) : Promise<boolean> {
        return (await prisma.entry({id:entryId}).owner()) == agentId;
    }
}
