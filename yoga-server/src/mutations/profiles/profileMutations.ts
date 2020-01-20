import {prisma, ProfileType, StatusType} from "../../generated";
import {CommonQueries} from "../../queries/commonQueries";

export class ProfileMutations {
    public static async createProfile(csrfToken: string, authToken: string, name: string, picture: string, timezone: string, type: ProfileType) {
        const userAndSession = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!userAndSession) {
            throw new Error("Invalid csrf- or auth token");
        }

        const profile = await prisma.createProfile({
            name: name,
            picture: picture,
            timezone: timezone,
            creator: {
                connect: {
                    id: userAndSession.user.id
                }
            },
            type: type,
            isBot: false, // TODO: The following three properties are just hardcoded for the moment
            status: "",
            isHidden: false
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

    public static async updateProfile(csrfToken: string, authToken: string, profileId: string, type: ProfileType, name: string, picture: string, timezone: string, status: StatusType) {
        const userAndSession = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!userAndSession) {
            throw new Error("Invalid csrf- or auth token");
        }

        return await prisma.updateProfile({
            data: {
                name: name,
                pictureAvatar: picture,
                timezone: timezone,
                status: status,
                type: type
            },
            where: {
                id: profileId
            }
        }).id();
    }
}
