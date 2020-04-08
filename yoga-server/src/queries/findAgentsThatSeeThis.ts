import {Group, prisma} from "../generated/prisma_client";
import {Init, Server} from "../init";

export class FindAgentsThatSeeThis {
    public static async entry(server:Server, entryId:string) {
        let entry = await prisma.entry({id:entryId});
        if (!entry) {
            // Check memory entries
            entry = server.memoryEntries.getEntry(entryId);
        }
        if (!entry) {
            return [];
        }

        let groups = await prisma.groups({
            where: {
                entries_some: {
                    id: entryId
                }
            }
        });

        let group:Group;
        if (groups.length > 0) {
            group = groups[0];
        }
        if (!group) {
            const memoryGroupId = server.memoryEntries.getGroup(entryId);
            group = await prisma.group({id:memoryGroupId});
        }
        if (!group) {
            return [];
        }

        const memberships = await prisma.group({id: group.id}).memberships();

        const members = [];
        for (let membership of memberships) {
            const memberId = await prisma.membership({id:membership.id}).member().id();
            members.push(memberId);
        }

        let owners = [entry.owner];
        if (entry.owner != group.owner) {
            owners.push(group.owner);
        }

        return owners.concat(members);
    }

    public static async room(roomId:string) {
        const group = await prisma.group({id: roomId});
        const memberships = await prisma.group({id: roomId}).memberships();

        const members = [];
        for (let membership of memberships) {
            const memberId = await prisma.membership({id:membership.id}).member().id();
            members.push(memberId);
        }

        let owners = [group.owner];
        return owners.concat(members);
    }
}