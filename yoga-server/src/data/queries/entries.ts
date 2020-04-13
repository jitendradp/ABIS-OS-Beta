import {AgentCanSee} from "../../statements/agentCanSee";
import {Server} from "../../init";
import {Entry, prisma} from "../../generated";

export class EntryQueries {
    public static async getEntries(server:Server, agentId:string, groupId:string, from?:Date, to?:Date) : Promise<Entry[]> {
        if (!(await AgentCanSee.group(agentId, groupId))) {
            return [];
        }

        const group = await prisma.group({id:groupId});
        if (group.isMemory) {
            server.memoryEntries.read(groupId, {});
        } else {
            // TODO: Add the date filter
            return prisma.group({id:groupId}).entries();
        }
    }
}
