import {Agent, Group, GroupType, prisma} from "../../../generated";
import {CommonQueries} from "../commonQueries";
import {Helpers} from "../../../helper/Helpers";

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
    public static async myStashes(csrfToken: string, bearerToken: string) {
        const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
        if (!myAgent) {
            Helpers.abortInvalidRequest("Couldn't find a session or an agent for the supplied csrf and bearer-token");
        }

        const myStashes = await prisma.groups({where: {type: "Stash", owner: myAgent.id}});
        return myStashes;
    }

    public static async myChannels(csrfToken: string, bearerToken: string) {
        const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
        if (!myAgent) {
            Helpers.abortInvalidRequest("Couldn't find a session or an agent for the supplied csrf and bearer-token");
        }

        const myChannels = await prisma.groups({where: {type: "Channel", owner: myAgent.id}});
        return myChannels;
    }

    public static async myRooms(csrfToken: string, bearerToken: string) {
        const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
        if (!myAgent) {
            Helpers.abortInvalidRequest("Couldn't find a session or an agent for the supplied csrf and bearer-token");
        }

        const myRooms = await prisma.groups({where: {type: "Room", owner: myAgent.id}});
        return myRooms;
    }

    public static async myMemberships(csrfToken: string, bearerToken: string, groupType?: GroupType, isPublic?: boolean): Promise<Membership[]> {
        const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
        if (!myAgent) {
            Helpers.abortInvalidRequest("Couldn't find a session or an agent for the supplied csrf and bearer-token");
        }

        const persistedMemberships = await prisma.memberships({where: {member: {id: myAgent.id}}});

        // Speciality of the "myMemberships" query:
        // * Load all groups for the Membership
        const myMemberships = (await  Promise.all(
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
                    ... someMemberships
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
                    Helpers.softAbortInvalidRequest("FATAL ERROR: Couldn't find a group in which membership '" + m.id + "' belongs.");
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
    }
}
