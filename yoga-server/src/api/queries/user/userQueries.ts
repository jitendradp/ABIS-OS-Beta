import {CommonQueries} from "../commonQueries";
import {Profile, Service} from "../../Profile";
import {prisma} from "../../../generated/prisma_client";
import {Helper} from "../../../helper/helper";
import {ActionResponse} from "../../mutations/actionResponse";

export class UserQueries {
    static async myAccount(csrfToken: string, bearerToken: string) {
        try {
            let user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
            return user.user;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during an account query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async myProfiles(csrfToken: string, bearerToken: string) {
        try {
            const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
            if (!sessionAndUser && sessionAndUser.user) {
                return [];
            }

            const myProfiles = (await prisma.agents({
                where: {
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
                status: profileAgent.status,
                timezone: profileAgent.timezone,
                location: null
            });
            return myProfiles;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during a profile query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async myServices(csrfToken: string, bearerToken: string) {
        try {
            const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
            if (!sessionAndUser && sessionAndUser.user) {
                return [];
            }

            const myServices = (await prisma.agents({
                where: {
                    owner: sessionAndUser.user.id,
                    type: "Service"
                }
            })).map(profileAgent => <Service>{
                id: profileAgent.id,
                createdAt: profileAgent.createdAt,
                createdBy: profileAgent.createdBy,
                name: profileAgent.name,
                profileType: profileAgent.profileType,
                status: profileAgent.status,
                timezone: profileAgent.timezone,
                description: profileAgent.serviceDescription,
                location: null
            });
            return myServices;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during a service query: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
