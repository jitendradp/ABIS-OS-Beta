import {prisma} from "../generated";

export class AgentCanPostTo {
    public static async room(agentId:string, roomId:string) {
        const writableRoom = await prisma.groups({
            where:{
                id:roomId,
                type: "Room",
                OR:[{
                    memberships_some:{
                        member:{
                            id:agentId
                        }
                    }
                }, {
                    owner:agentId
                }]
            }
        });

        return writableRoom.length > 0;
    }

    public static async channel(agentId:string, channelId:string) {
        const writableChannel = await prisma.groups({
            where:{
                id:channelId,
                type: "Channel",
                owner: agentId
            }
        });

        return writableChannel.length > 0;
    }

    public static async stash(agentId:string, stashId:string) {
        const writableStash = await prisma.groups({
            where:{
                id:stashId,
                type: "Stash",
                owner: agentId
            }
        });

        return writableStash.length > 0;
    }
}