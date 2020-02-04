import {Entry, prisma} from "../generated";
import {MembershipStatements} from "../rules/membershipStatements";

export class EntryQueries {
    public static async getEntries(agentId:string, groupId:string, from?:Date, to?:Date) : Promise<Entry[]> {
        if (!(await MembershipStatements.agentIsMemberOfGroup(agentId, groupId))) {
            return [];
        }

        // TODO: Add the date filter

        return prisma.group({id:groupId}).entries();
    }
}
