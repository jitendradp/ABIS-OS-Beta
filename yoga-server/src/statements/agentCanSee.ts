import {Server} from "../init";
import {GroupType, prisma} from "../generated";

/**
 * Contains methods to determine if an agent can see a particular object.
 */
export class AgentCanSee {

    public static async group(agentId: string, groupId: string, type?: GroupType): Promise<boolean> {
        const queryParams = {
            where: {
                id: groupId,
                OR: [{
                    memberships_some: {
                        member: {
                            id: agentId
                        }
                    }
                }, {
                    owner: agentId
                }, {
                    isPublic: true
                }]
            }
        };
        if (type) {
            queryParams.where["type"] = type;
        }
        const agentMembershipGroups = await prisma.groups(queryParams);
        if (agentMembershipGroups.length == 0) {
            return false;
        }

        return agentMembershipGroups.filter(o => o.id == groupId) !== undefined;
    }

    public static async room(agentId: string, roomId: string) {
        return AgentCanSee.group(agentId, roomId, "Room");
    }

    public static async channel(agentId: string, channelId: string) {
        return AgentCanSee.group(agentId, channelId, "Channel");
    }

    public static async stash(agentId: string, stashId: string) {
        return AgentCanSee.group(agentId, stashId, "Stash");
    }

    public static async entry(server: Server, agentId: string, entryId: string) {
        let groups = await prisma.groups({
            where: {
                entries_some: {
                    id: entryId
                },
                OR: [{
                    isPublic: true
                }, {
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

        if (groups.length == 0) {
            const memoryGroupId = server.memoryEntries.getGroup(entryId);
            groups = await prisma.groups({
                where: {
                    id: memoryGroupId,
                    memberships_some: {
                        member: {
                            id: agentId
                        }
                    }
                }
            });
        }

        return groups.length == 1;
    }
}
