import {AgentOwns} from "./agentOwns";

export class AgentCanEdit {
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
        return AgentOwns.entry(agentId, entryId);
    }
}