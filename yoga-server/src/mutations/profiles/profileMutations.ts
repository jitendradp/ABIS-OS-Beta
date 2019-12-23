import {prisma} from "../../generated";

export class ProfileMutations {
    public async createProfile(token: string, name: string, picture: string, timezone: string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let profile = await prisma.createProfile({
            name: name,
            picture: picture,
            timezone: timezone
        });
        await prisma.updateUser({
            data: {
                profiles: {
                    connect: {
                        id: profile.id
                    }
                }
            },
            where: {id: user.id}
        });
        return profile.id;
    }

    public async updateProfile(token: string, profileId: string, name: string, picture: string, timezone: string, status: string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        return await prisma.updateProfile({
            data: {
                name: name,
                picture: picture,
                timezone: timezone,
                status: status
            },
            where: {
                id:profileId
            }
        }).id();
    }
}
