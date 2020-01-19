import {prisma} from "../../generated";
import {CommonQueries} from "../commonQueries";

export class ProfileQueries {
    public static async getSessionProfile(csrfToken:string, authToken:string) {
        const sessionQuery = prisma.session({authToken:authToken});
        const account = await sessionQuery.account();
        if (!account) {
            throw new Error("Invalid authToken");
        }

        const session = await sessionQuery;
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrf- or auth token");
        }
        let currentProfile = await prisma.session({authToken}).profile();
        if (!currentProfile) {
            const lastUsedProfileId = await prisma.session({authToken}).account().lastUsedProfileId();
            if (lastUsedProfileId) {
                currentProfile = await  prisma.profile({id: lastUsedProfileId});
            }
        }
        if (!currentProfile) {
            return null;
        } else {
            return currentProfile;
        }
    }

    public static async listProfiles(csrfToken:string, authToken:string) {
        const profiles = await prisma.session({authToken:authToken}).account().profiles();
        if (!profiles) {
            throw new Error("Invalid authToken");
        }

        const session = await prisma.session({authToken:authToken});
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrf- or auth token");
        }

        return profiles;
    }

    public static async getProfile(csrfToken:string, authToken:string, profileId:string) {
        const session = await CommonQueries.findSession(csrfToken, authToken);
        if (!session) {
            throw new Error("Invalid csrf- or auth token");
        }

        return prisma.profile({id: profileId});
    }
}
