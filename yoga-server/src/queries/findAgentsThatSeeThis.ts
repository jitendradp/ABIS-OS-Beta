import {prisma} from "../generated";

export class FindAgentsThatSeeThis {
    public static async entry(entryId:string) {
        const entry = await prisma.entry({id:entryId});
        if (!entry) {
            return [];
        }

        const group = await prisma.groups({
            where: {
                entries_some: {
                    id: entryId
                }
            }
        });
        if (!group) {
            return [];
        }

        const members = await prisma.group({id: group[0].id}).memberships();

        let owners = [entry.owner];
        if (entry.owner != group[0].owner) {
            owners.push(group[0].owner);
        }

        return owners.concat(members.map(o => o.id));
    }
}