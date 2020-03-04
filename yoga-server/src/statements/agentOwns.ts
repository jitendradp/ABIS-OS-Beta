import {GroupType, prisma} from "../generated/prisma_client";

export class AgentOwns {
    public static async group(agentId:string, groupId:string, type?:GroupType) {
        const queryParams = {where:{id: groupId, owner:agentId}};
        if (type) {
            queryParams.where["type"] = type;
        }
        const ownedGroups = await prisma.groups(queryParams);
        if (ownedGroups.length != 1) {
            return false;
        }
        return ownedGroups[0].owner == agentId;
    }

    public static async stash(agentId:string, stashId:string) : Promise<boolean> {
        return AgentOwns.group(agentId, stashId, "Stash");
    }

    public static async channel(agentId:string, channelId:string) : Promise<boolean> {
        return AgentOwns.group(agentId, channelId, "Channel");
    }

    public static async room(agentId:string, roomId:string) : Promise<boolean> {
        return AgentOwns.group(agentId, roomId, "Room");
    }

    public static async entry(agentId:string, entryId:string) : Promise<boolean> {
        return (await prisma.entry({id:entryId}).owner()) == agentId;
    }
}