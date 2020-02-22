import {prisma} from "../generated";

export class AgentCanInviteTo {
    public static async room(agentId: string, roomId: string) {
        const groups = await prisma.groups({
            where: {
                id: roomId,
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

        return groups.length > 0;
    }
}