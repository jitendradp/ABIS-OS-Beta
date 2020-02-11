import {prisma} from "../generated";

export class MembershipStatements {
    /**
     * Determines if a Group contains a Membership of a specific Agent.
     * @param agentId The agent id
     * @param groupId The group id
     */
    public static async agentCanAccessGroup(agentId:string, groupId:string) : Promise<boolean> {
        const agentMembershipGroups = await prisma.groups({where:{OR:[{memberships_some:{member:{id:agentId}}}, {owner:agentId}]}});
        if (agentMembershipGroups.length == 0) {
            return false;
        }

        return agentMembershipGroups.filter(o => o.id == groupId) !== undefined;
    }

    static async agentCanAccessRoom(agentId: string, roomId: string) {
        const agentMembershipGroups = await prisma.groups({where:{type:"Room", memberships_some:{member:{id:agentId}}, OR:{owner:agentId}}});
        if (agentMembershipGroups.length == 0) {
            return false;
        }

        return agentMembershipGroups.filter(o => o.id == roomId) !== undefined;
    }
}
