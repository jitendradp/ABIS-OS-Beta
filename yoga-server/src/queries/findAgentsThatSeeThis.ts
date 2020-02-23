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

        const memberships = await prisma.group({id: group[0].id}).memberships();

        const members = [];
        for (let membership of memberships) {
            const memberId = await prisma.membership({id:membership.id}).member().id();
            members.push(memberId);
        }

        let owners = [entry.owner];
        if (entry.owner != group[0].owner) {
            owners.push(group[0].owner);
        }

        return owners.concat(members);
    }
}