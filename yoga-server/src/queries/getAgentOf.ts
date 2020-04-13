import {prisma} from "../generated";

export class GetAgentOf {
    public static async session(csrfToken:string, sessionToken?:string) {
        const now = new Date();
        const queryParameters = {
            where:{
                csrfToken: csrfToken,
                createdAt_lt: now,
                validTo_gt: now,
                timedOut: null,
                loggedOut: null
            }
        };
        if (sessionToken) {
            queryParameters.where["sessionToken"] = sessionToken;
        }
        const session = await prisma.sessions(queryParameters);
        if (session.length == 0) {
            throw new Error(`No sessions was found for sessionToken '${sessionToken}'.`);
        }
        if (session.length > 1) {
            throw new Error(`Multiple sessions were found for sessionToken '${sessionToken}'.`);
        }
        const agent = await prisma.session({id:session[0].id}).agent();
        return agent.id;
    }
}