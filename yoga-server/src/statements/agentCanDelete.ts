import {AgentOwns} from "./agentOwns";
import {prisma} from "../generated";

export class AgentCanDelete {
    public static async room(agentId:string, roomId:string) {
        return AgentOwns.room(agentId, roomId);
    }
    public static async channel(agentId:string, channelId:string) {
        return AgentOwns.channel(agentId, channelId);
    }
    public static async stash(agentId:string, stashId:string) {
        return AgentOwns.stash(agentId, stashId);
    }
    public static async entry(agentId:string, entryId:string) {
        const owns = await AgentOwns.entry(agentId, entryId);
        if (owns) {
            return true;
        }
        const group = await prisma.groups({
            where:{
                entries_some:{
                    id: entryId
                },
                owner: agentId
            }
        });
        return group.length == 1;
    }
    public static async membership(agentId:string, groupId:string, memberAgentId:string) {
        throw new Error("Not implemented");
    }
}