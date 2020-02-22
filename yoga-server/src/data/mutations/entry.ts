import {EntryCreateInput, prisma} from "../../generated";

export class EntryMutations {
    public static async createEntryInGroup(groupId:string, entry:EntryCreateInput) {

        const persistedEntry = await prisma.createEntry(entry);

        await prisma.updateGroup({
            where: {id: groupId}, data: {
                entries: {
                    connect:{
                        id: persistedEntry.id
                    }
                }
            }
        });

        return persistedEntry;
    }
}
