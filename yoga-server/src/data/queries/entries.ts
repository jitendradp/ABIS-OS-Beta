import {Entry, prisma} from "../../generated";
import {AgentCanSee} from "../../statements/agentCanSee";

export class EntryQueries {
    public static async getEntries(agentId:string, groupId:string, from?:Date, to?:Date) : Promise<Entry[]> {
        if (!(await AgentCanSee.group(agentId, groupId))) {
            return [];
        }

        // TODO: Add the date filter
        return prisma.group({id:groupId}).entries();
    }
}
