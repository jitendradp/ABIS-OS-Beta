import {CommonQueries} from "../commonQueries";
import {GroupQueries} from "../../../queries/group";
import {MembershipQueries} from "../../../queries/memberships";
import {EntryWhereInput, prisma} from "../../../generated";
import {MembershipStatements} from "../../../rules/membershipStatements";
import {Helper} from "../../../helper/Helper";
import {ActionResponse} from "../../mutations/actionResponse";

export class GroupQueries2 {
    public static async findRooms(csrfToken: string, sessionToken: string, bearerToken: string, searchText?: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            const foundRooms = GroupQueries.findRooms(myAgent.id, searchText);
            return foundRooms;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during a room query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async findMemberships(csrfToken: string, sessionToken: string, bearerToken: string, roomId: string, searchText?: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            const foundMemberships = await MembershipQueries.findMemberships(myAgent.id, roomId, searchText);
            return foundMemberships;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during a membership query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async getEntries(csrfToken: string, sessionToken: string, bearerToken: string, groupId: string, from?: Date, to?: Date) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!await MembershipStatements.agentCanAccessGroup(myAgent.id, groupId)) {
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

            const entries = await prisma.group({id: groupId})
                                  .entries({
                                      where: entriesWhereInput
                                  });

            return entries;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during an entries-query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
