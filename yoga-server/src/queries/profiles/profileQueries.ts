import {prisma} from "../../generated";

export class ProfileQueries {
    public async getSessionProfile(token) {
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

    public async listProfiles(token) {
        return prisma.session({token: token}).user().profiles();
    }

    public async getProfile(token, profileId) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        return prisma.profile({id: profileId});
    }
}
