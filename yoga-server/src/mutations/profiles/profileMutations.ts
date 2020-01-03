import {prisma} from "../../generated";
import {CommonQueries} from "../../queries/commonQueries";

export class ProfileMutations {
    public static async createProfile(csrfToken: string, authToken:string, name: string, picture: string, timezone: string) {
        const userAndSession = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!userAndSession) {
            throw new Error("Invalid csrf- or auth token");
        }

        const profile = await prisma.createProfile({
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
            where: {id: userAndSession.user.id}
        });
        return profile.id;
    }

    public static async updateProfile(csrfToken: string, authToken:string, profileId: string, name: string, picture: string, timezone: string, status: string) {
        const userAndSession = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!userAndSession) {
            throw new Error("Invalid csrf- or auth token");
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
