import {Agent, Group, prisma} from "../generated";
import {MembershipStatements} from "../rules/membershipStatements";

export type UiMemberhsip = {
    id: string,
    type: string,

    createdBy: string,
    createdAt: string,

    updatedBy: string,
    updatedAt: string,

    groupType: string,
    group: Group,
    member: Agent,

    showHistory: boolean
};

export class MembershipQueries {
    public static async findMemberships(agentId:string, roomId?:string, searchText?:string) : Promise<UiMemberhsip[]> {
        if (!(await MembershipStatements.agentCanAccessRoom(agentId, roomId))) {
            return [];
        }

        const agent = await prisma.agent({id: agentId});
        const room = await prisma.group({id: roomId});

        return (await prisma.group({id: roomId})
                            .memberships({where:{member:{name_contains:searchText}}}))
                .map(m => {
                    return <UiMemberhsip>{
                        createdAt: m.createdAt,
                        createdBy: m.createdBy,
                        group: room,
                        groupType: room.type,
                        id: m.id,
                        member:agent,
                        showHistory: m.showHistory,
                        type: m.type,
                        updatedAt: m.updatedAt,
                        updatedBy: m.updatedBy
                    };
                });
    }
}
