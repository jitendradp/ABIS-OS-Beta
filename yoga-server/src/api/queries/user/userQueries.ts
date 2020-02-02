import {CommonQueries} from "../commonQueries";

export class UserQueries {
    public static async getUserInformation(csrfToken: string, authToken: string) : Promise<any> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);
        const userInformation = {
            id: sessionAndUser.user.id,
            createdAt: sessionAndUser.user.createdAt,
            email: sessionAndUser.user.email,
            firstName: sessionAndUser.user.personFirstName,
            lastName: sessionAndUser.user.personLastName
        };
        return userInformation;
    }

    static myAccount(csrfToken: string, bearerToken: string) {
        return undefined;
    }

    static myProfiles(csrfToken: string, bearerToken: string) {
        return undefined;
    }

    static myServices(csrfToken: string, bearerToken: string) {
        return undefined;
    }
}
