import {prisma, Session} from "../../generated";
import {Helper} from "../../helper/helper";
import {ProfileQueries} from "../queries/profile";
import {config} from "../../config";
import {UserOwns} from "../../statements/userOwns";

export class SessionMutations {

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

        if (!await UserOwns.profile(userId, agentId)) {
            throw new Error(`Either the User (${userId}), the Agent ${agentId} or both don't exist. Also the given agent might not belong to the given user.`);
        }

        const validTo = new Date(new Date().getTime() + config.auth.sessionTimeout);
        const csrfToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const bearerToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const sessionToken = Helper.getRandomBase64String(config.auth.tokenLength);

        //return await SessionMutations.createSession(csrfToken, bearerToken, sessionToken, validTo, userId, agentId);
        throw new Error("Not implemented");
    }

    /**
     * Generates a new csrf- and session-token for an anonymous profile.
     */
    public static async createAnonymousSession(clientTime:string): Promise<Session> {
        const anonUser = await prisma.user({email:config.env.anonymousUser});
        if (!anonUser) {
            throw new Error("Couldn't find the anonymous system user: " + config.env.anonymousUser);
        }

        // Create an anonymous profile
        const anonProfile = await prisma.createAgent({
            owner: anonUser.id,
            implementation: "Profile",
            createdBy: anonUser.id,
            name: "Anon_" +   Helper.getRandomBase64String(12),
            type: "Profile",
            status: "Available",
            profileType: "Anonymous"
        });

        const validTo = new Date(new Date().getTime() + config.auth.sessionTimeout);
        const csrfToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const sessionToken = Helper.getRandomBase64String(config.auth.tokenLength);


        throw new Error("Not implemented");
    }
}
