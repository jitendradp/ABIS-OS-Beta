import {CommonQueries} from "../commonQueries";
import {Helper} from "../../../helper/helper";
import {ActionResponse} from "../../mutations/actionResponse";
import {AgentCanSee} from "../../../statements/agentCanSee";
import {Init} from "../../../init";
import {Entry, EntryWhereInput, prisma} from "../../../generated";
import type = Mocha.utils.type;

export class GroupQueries2 {

    public static async getEntries(csrfToken: string, sessionToken: string, bearerToken: string, groupId: string, from?: Date, to?: Date) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!await AgentCanSee.group(myAgent.id, groupId)) {
                return [];
            }

            let entriesWhereInput: EntryWhereInput = null;

            if (from && to) {
                entriesWhereInput = {
                    AND: {
                        createdAt_gte: from,
                        createdAt_lte: to
                    }
                };
            }
            else if (from) {
                entriesWhereInput = {
                    createdAt_gte: from
                };

            }
            else if (to) {
                entriesWhereInput = {
                    createdAt_lte: to
                };
            }

            const group = await prisma.group({id:groupId});
            let entries:Entry[];
            if (group.isMemory) {
                entries = Init.memoryEntries.read(groupId, entriesWhereInput);
            } else {
                entries = await prisma.group({id: groupId})
                    .entries({
                        where: entriesWhereInput,
                        orderBy: "createdAt_ASC"
                    });
            }

            return entries.map(async o => {

                const tags = await prisma.tags({
                    where: {
                        forId: o.id
                    }
                });

                const typesAndCount:{[type:string]:number} = {};
                tags.forEach(tag => {
                   if (!typesAndCount[tag.tagType]) {
                       typesAndCount[tag.tagType] = 0;
                   }
                   typesAndCount[tag.tagType]++;
                });

                (<any>o).tagAggregate = Object.keys(typesAndCount).map(key => {
                    return {
                        type: key,
                        count: typesAndCount[key]
                    }
                });

                // @ts-ignore
                if ((<any>o).contentEncoding && (<any>o).contentEncoding.id) {  // TODO: Bullshit!
                    (<any>o).contentEncoding = await prisma.contentEncoding({id: (<any>o).contentEncoding.id}) ?? "";
                } else if ((<any>o).contentEncoding) {
                    (<any>o).contentEncoding = await prisma.contentEncoding({id: o.contentEncoding}) ?? "";
                }
                return o;
            });
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during an entries-query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
