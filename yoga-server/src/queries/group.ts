import {Group, GroupWhereInput, prisma} from "../generated";

export class GroupQueries {
    public static async findStashesOfAgent(agentId: string): Promise<Group[]> {
        return prisma.groups({where: {owner: agentId, type: "Stash"}});
    }

    public static async findChannelsOfAgent(agentId: string): Promise<Group[]> {
        const channels = await prisma.groups({where: {owner: agentId, type: "Channel"}});

        for (const o of channels) {
           let memberships = await prisma.group({id: o.id}).memberships();
           if (memberships.length == 0) {
               throw new Error(`Channel ${o.id} doesn't have a member.`);
           }

           let memberAgent = await prisma.membership({id:memberships[0].id}).member();
           (<any>o).receiver = memberAgent;
        }

        return channels;
    }

    public static async findRRoomsOfAgent(agentId: string): Promise<Group[]> {
        return prisma.groups({where: {owner: agentId, type: "Room"}});
    }

    public static async findRooms(agentId: string, searchText?: string) : Promise<Group[]> {
        if (!searchText) {
            searchText = "";
        }
        const options = {
            where: <GroupWhereInput>{
                OR: {
                    isPublic: true,
                    memberships_some: {member: {id: agentId}},
                    owner: agentId
                },
                AND: {
                    type: "Room"
                }
            }
        };
        if (searchText) {
            options.where.AND["OR"] = {
                name_contains: searchText,
                title_contains: searchText
            };
        }

        const rooms = await prisma.groups(options);
        return rooms;
    }
}
