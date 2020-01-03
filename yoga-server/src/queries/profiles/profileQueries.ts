import {prisma} from "../../generated";

export class ProfileQueries {
    public static async getSessionProfile(csrfToken:string, authToken:string) {
        let sessionQuery = prisma.session({authToken:authToken});
        let user = await sessionQuery.user();
        if (!user) {
            throw new Error("Invalid authToken");
        }

        let session = await sessionQuery;
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrfToken");
        }
        let currentProfile = await prisma.session({authToken}).profile();
        if (!currentProfile) {
            let lastUsedProfileId = await prisma.session({authToken}).user().lastUsedProfileId();
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
        let profiles = await prisma.session({authToken:authToken}).user().profiles();
        if (!profiles) {
            throw new Error("Invalid authToken");
        }

        let session = await prisma.session({authToken:authToken});
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrfToken");
        }

        return profiles;
    }

    public static async getProfile(csrfToken:string, authToken:string, profileId:string) {
        let sessionQuery = prisma.session({authToken:authToken});
        let user = await sessionQuery.user();
        if (!user) {
            throw new Error("Invalid authToken");
        }
        let session = await sessionQuery;
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrfToken");
        }

        return prisma.profile({id: profileId});
    }
}
