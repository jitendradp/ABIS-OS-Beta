import {prisma} from "../../generated";

export class ProfileMutations {
    public static async createProfile(csrfToken: string, authToken:string, name: string, picture: string, timezone: string) {
        let sessionQuery = prisma.session({authToken:authToken});
        let user = await sessionQuery.user();
        if (!user) {
            throw new Error("Invalid authToken");
        }

        let session = await prisma.session({authToken:authToken});
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrfToken");
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

    public static async updateProfile(csrfToken: string, authToken:string, profileId: string, name: string, picture: string, timezone: string, status: string) {
        let sessionQuery = prisma.session({authToken:authToken});
        let user = await sessionQuery.user();
        if (!user) {
            throw new Error("Invalid authToken");
        }

        let session = await sessionQuery;
        if (session.csrfToken !== csrfToken) {
            throw new Error("Invalid csrfToken");
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
