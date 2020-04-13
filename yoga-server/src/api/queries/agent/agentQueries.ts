import {CommonQueries} from "../commonQueries";
import {Helper} from "../../../helper/helper";
import {ActionResponse} from "../../mutations/actionResponse";
import {GroupQueries} from "../../../data/queries/group";
import {config} from "../../../config";
import {Agent, Group, GroupType, prisma} from "../../../generated";

export type MembershipType =
    "Invite" |
    "Single" |
    "Multi";

export type Membership = {
    id: string,
    type: MembershipType,

    createdBy: string,
    createdAt: string,

    updatedBy: string,
    updatedAt: string,

    groupType: GroupType,    // Is only set to a value when returned by "query myMemberships()".
    group: Group,            // .. When navigated from a Group, this is 'null'.

    member: Agent,          // This is only set when queried from a group.

    showHistory: boolean
}

export class AgentQueries {
    public static async getSystemServices(csrfToken: string, sessionToken: string) {
        try {
            const systemUserAgents = await prisma.user({email: config.env.systemUser}).agents();
            if (!systemUserAgents) {
                throw new Error(`Couldn't find any system user agents. User: '${config.env.systemUser}'.`)
            }

            return systemUserAgents;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during an account query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async myStashes(csrfToken: string, sessionToken: string, bearerToken?: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!myAgent) {
                throw new Error(`Invalid bearer- and/or csrf-token.`);
            }
            return GroupQueries.findStashesOfAgent(myAgent.id);
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during querying 'myStashes': ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async myChannels(csrfToken: string, sessionToken: string, bearerToken: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!myAgent) {
                throw new Error(`Invalid bearer- and/or csrf-token.`);
            }
            const myChannels = await GroupQueries.findChannelsOfAgent(myAgent.id);
            return myChannels;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during querying 'myChannels': ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async myRooms(csrfToken: string, sessionToken: string, bearerToken: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!myAgent) {
                throw new Error(`Invalid bearer- and/or csrf-token.`);
            }
            return GroupQueries.findRoomsOfAgent(myAgent.id);
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during querying 'myRooms': ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async findRooms(csrfToken: string, sessionToken: string, bearerToken: string, searchText:string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!myAgent) {
                throw new Error(`Invalid bearer- and/or csrf-token.`);
            }
            return GroupQueries.findRooms(myAgent.id, searchText);
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during querying 'myRooms': ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    public static async myMemberships(csrfToken: string, sessionToken: string, bearerToken: string, groupType?: GroupType, isPublic?: boolean) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!myAgent) {
                throw new Error(`Invalid bearer- and/or csrf-token.`);
            }

            const persistedMemberships = await prisma.memberships({where: {member: {id: myAgent.id}}});

            // Speciality of the "myMemberships" query:
            // * Load all groups for the Membership
            const myMemberships = (await Promise.all(
                persistedMemberships.map(async m => {
                    const someMemberships = {
                        memberships_some: {
                            member: {
                                id: myAgent.id
                            }
                        }
                    };
                    const isPublicPart = {
                        isPublic: true
                    };
                    let where = {
                        ...someMemberships
                    };

                    if (isPublic) {
                        where = {
                            ...where,
                            ...isPublicPart
                        }
                    }

                    let foundGroups = (await prisma.groups({
                        where: where
                    }));

                    if (!foundGroups || foundGroups.length != 1) {
                        throw new Error(`FATAL ERROR: Couldn't find a group in which membership '${m.id}' belongs.`);
                        return null;
                    }

                    return <Membership>{
                        id: m.id,
                        createdAt: m.createdAt,
                        createdBy: m.createdBy,
                        updatedAt: m.updatedAt,
                        updatedBy: m.createdBy,
                        group: foundGroups[0],
                        groupType: foundGroups[0].type,
                        member: myAgent,
                        showHistory: m.showHistory,
                        type: "Invite"
                    };
                })))
                .filter(o => o !== null);

            return myMemberships;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during querying 'myMemberships': ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
