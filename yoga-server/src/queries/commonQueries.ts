import {prisma, Profile, Session, User} from "../generated";

export class CommonQueries {

    public static async findUserSessions(userId: string) : Promise<Session[]> {
        return await prisma.sessions({where:{user:{id:userId}, validTo_gt: new Date(), timedOut:null, loggedOut:null}});
    }

    public static async findSession(csrfToken: string, authToken: string) : Promise<Session> {
        const sessions = await prisma.sessions({where:{csrfToken, authToken, validTo_gt: new Date(), timedOut:null, loggedOut:null}});
        if (sessions.length == 1) {
            return sessions[0];
        } else if (sessions.length > 1) {
            throw new Error("There is more than one session for a csrfToken/authToken combination. Go, get a gun and shoot yourself!");
        }

        return null;
    }

    public static async findProfileBySession(csrfToken: string, authToken: string) : Promise<Profile> {
        const session = await this.findSession(csrfToken, authToken);
        if (!session){
            return null;
        }
        return prisma.session({id:session.id}).profile();
    }

    public static async findUserBySession(csrfToken: string, authToken: string) : Promise<{session:Session, user:User}> {
        const session = await this.findSession(csrfToken, authToken);
        if (!session){
            return null;
        }
        const wrapper = {
            session: session,
            user: await prisma.session({id:session.id}).user()
        };
        return wrapper;
    }
}
