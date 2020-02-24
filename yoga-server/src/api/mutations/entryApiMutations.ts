import {Helper} from "../../helper/helper";
import {ActionResponse} from "./actionResponse";
import {EntryType, prisma} from "../../generated";
import {CommonQueries} from "../queries/commonQueries";
import {AgentOwns} from "../../statements/agentOwns";
import {AgentCanSee} from "../../statements/agentCanSee";

export class EntryApiMutations {
    static async createEntry(
        csrfToken: string
        , sessionToken: string
        , bearerToken: string
        , groupId: string
        , type: EntryType
        , name?:string
        , content?:string
        , contentEncoding?:string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!(await AgentCanSee.group(myAgent.id, groupId))) {
                throw new Error(`Agent ${myAgent.id} cannot access group ${groupId}, in which the new entry should be created.`);
            }

            const now = Date.now();
            await prisma.updateGroup({
                where: {id:groupId},
                data: {
                    entries:{
                        create: {
                            createdBy: myAgent.id,
                            owner: myAgent.id,
                            type: type,
                            name: name,
                            content: content,
                            contentEncoding: contentEncoding
                        }
                    }
                }
            });

            const newEntries = await prisma.entries({
                where:{
                    owner: myAgent.id,
                    type: type,
                    name:name,
                    contentEncoding:contentEncoding,
                    createdAt_gte: new Date(now)},
                orderBy:"createdAt_ASC"});

            // TODO: possible race condition
            if (newEntries.length != 1) {
                throw new Error("Couldn't find the newly created entry.");
            }

            return  newEntries[0];
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during the creation of a new entry: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async deleteEntry(csrfToken: string, sessionToken: string, bearerToken: string, entryId: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);

            // The owner of a group can always delete items from that group.
            // In all other circumstances, only the owner can delete items.
            const inGroup = await prisma.groups({where:{entries_some:{id: entryId}}});
            if (inGroup.length != 1) {
                // fact "E.G.1 Alle Einträge müssen in einer Gruppe sein"
                throw new Error(`The entry ${entryId} either doesn't exist or isn't contained in one group.`)
            }

            if (inGroup[0].owner != myAgent.id && !(await AgentOwns.entry(myAgent.id, entryId))) {
                throw new Error(`Agent ${myAgent.id} doesn't own entry ${entryId}, which it tries to delete.`);
            }

            await prisma.deleteEntry({id: entryId});
            return <ActionResponse>{
                success: true,
                code: Helper.getRandomBase64String(8)
            };
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during the deletion of an entry: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
