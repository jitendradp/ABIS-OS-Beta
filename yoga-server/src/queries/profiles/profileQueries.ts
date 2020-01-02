import {prisma} from "../../generated";

export class ProfileQueries {
    public static async getSessionProfile(token:string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let currentProfile = await prisma.session({token: token}).profile();
        if (!currentProfile) {
            let lastUsedProfileId = await prisma.session({token: token}).user().lastUsedProfileId();
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

    public static async listProfiles(token:string) {
        return prisma.session({token: token}).user().profiles();
    }

    public static async getProfile(token:string, profileId:string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        return prisma.profile({id: profileId});
    }
}
