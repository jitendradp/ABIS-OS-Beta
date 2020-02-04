import {CommonQueries} from "../commonQueries";
import {GroupQueries} from "../../../queries/group";

export class GroupQueries2 {
    public static async findRooms(csrfToken: string, bearerToken: string, searchText?: string) {
        const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
        GroupQueries.findRooms(myAgent.id, searchText);
    }

    public static async findMemberships(csrfToken: string, bearerToken: string, roomId: string, searchText?: string) {
        return undefined;
    }

    public static async getEntries(csrfToken: string, bearerToken: string, groupId: string, from?: Date, to?: Date) {
        return undefined;
    }
}
