import {prisma, Session} from "../generated";
import {Helper} from "../helper/Helper";
import {ProfileQueries} from "../queries/profile";
import {OwnershipStatements} from "../rules/ownershipStatements";
import {config} from "../config";

export class SessionMutations {
    /**
     * Creates a new session.
     * @param csrfToken
     * @param bearerToken
     * @param validTo
     * @param userId
     * @param agentId
     */
    public static async createSession(csrfToken:string, bearerToken:string, validTo:Date, userId:string, agentId:string) {
        const session = await prisma.createSession({
            timedOut: null,
            csrfToken: csrfToken,
            bearerToken: bearerToken,
            validTo: validTo,
            user: {
                connect: {
                    id: userId
                }
            },
            agent: {
                connect: {
                    id: agentId
                }
            }
        });

        Helper.log(`Created session for user ${userId} with agent ${agentId}. Expires: ${validTo.toISOString()}`);

        return session;
    }

    /**
     * Generates a new csrf- and bearer-token for the specified user and agent pair and stores it as session.
     * @param userId
     * @param agentId
     */
    public static async createSessionForUserAndAgent(userId: string, agentId?: string): Promise<Session> {
        if (!agentId) {
            // Try to find the first profile of the user
            const foundAgent =  await ProfileQueries.findFirstProfileOfUser(userId);

            if (!foundAgent) {
                throw new Error(`Couldn't find a Profile-Agent for User (${userId}).`);
            }

            agentId = foundAgent.id;
        }

        if (!await OwnershipStatements.userOwnsProfile(userId, agentId)) {
            throw new Error(`Either the User (${userId}), the Agent ${agentId} or both don't exist. Also the given agent might not belong to the given user.`);
        }

        const validTo = new Date(new Date().getTime() + config.auth.sessionTimeout);
        const csrfToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const bearerToken = Helper.getRandomBase64String(config.auth.tokenLength);

        return await SessionMutations.createSession(csrfToken, bearerToken, validTo, userId, agentId);
    }

    public static async verifySession(csrfToken: string, bearerToken: string): Promise<boolean> {
        const sessions = await prisma.sessions({where:{csrfToken:csrfToken, bearerToken: bearerToken}});
        if (sessions.length != 1) {
            return  false;
        }
        const session = sessions[0];
        return SessionMutations.isSessionValid(session);
    }

    private static isSessionValid(session: Session): boolean {
        return session.id
            && session.timedOut == null
            && session.loggedOut == null
            && Date.parse(session.validTo) > Date.now();
    }
}
