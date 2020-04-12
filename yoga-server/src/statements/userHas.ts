import {prisma} from "../generated/prisma_client";

export class UserHas {
    /**
     * Note: This also returns 'true' when the user has an authenticated session.
     */
    public static async anonymousSession(sessionToken:string, csrfToken:string) {
        const now = new Date();
        const session = await prisma.sessions({
            where:{
                sessionToken: sessionToken,
                csrfToken: csrfToken,
                createdAt_lt: now,
                validTo_gt: now,
                timedOut: null,
                loggedOut: null
            }
        });
        return session.length == 1;
    }

    public static async authenticatedSession(sessionToken:string, csrfToken:string, bearerToken:string) {
        const now = new Date();
        const session = await prisma.sessions({
            where:{
                sessionToken: sessionToken,
                csrfToken: csrfToken,
                bearerToken_not: null,
                createdAt_lt: now,
                validTo_gt: now,
                timedOut: null,
                loggedOut: null
            }
        });
        return session.length == 1 && session[0].bearerToken === bearerToken;
    }
}