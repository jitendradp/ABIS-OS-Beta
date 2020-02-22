import {prisma} from "../generated";

export class GetAgentOf {
    public static async session(sessionToken:string, csrfToken:string) {
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
        if (session.length != 1) {
            throw new Error(`No or multiple sessions where found for sessionToken '${sessionToken}'.`);
        }
        const agent = await prisma.session({id:session[0].id}).agent();
        return agent.id;
    }
}