import {CommonQueries} from "../commonQueries";
import {Profile, Service} from "../../Profile";
import {prisma} from "../../../generated";

export class UserQueries {
    static async myAccount(csrfToken: string, bearerToken: string) {
        return CommonQueries.findUserBySession(csrfToken, bearerToken);
    }

    static async myProfiles(csrfToken: string, bearerToken: string) : Promise<Profile[]> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
        if (!sessionAndUser && sessionAndUser.user) {
            return [];
        }

        const myProfiles = (await prisma.agents({
            where:{
                owner: sessionAndUser.user.id,
                type: "Profile"
            }
        })).map(profileAgent => <Profile>{
            id: profileAgent.id,
            createdAt: profileAgent.createdAt,
            createdBy: profileAgent.createdBy,
            name: profileAgent.name,
            avatar: profileAgent.profileAvatar,
            banner: profileAgent.profileBanner,
            jobTitle: profileAgent.profileJobTitle,
            profileType: profileAgent.profileType,
            slogan: profileAgent.profileSlogan,
            status:profileAgent.status,
            timezone: profileAgent.timezone,
            location: null
        });
        return myProfiles;
    }

    static async myServices(csrfToken: string, bearerToken: string) {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
        if (!sessionAndUser && sessionAndUser.user) {
            return [];
        }

        const myServices = (await prisma.agents({
            where:{
                owner: sessionAndUser.user.id,
                type: "Service"
            }
        })).map(profileAgent => <Service>{
            id: profileAgent.id,
            createdAt: profileAgent.createdAt,
            createdBy: profileAgent.createdBy,
            name: profileAgent.name,
            profileType: profileAgent.profileType,
            status:profileAgent.status,
            timezone: profileAgent.timezone,
            description: profileAgent.serviceDescription,
            location: null
        });
        return myServices;
    }
}
