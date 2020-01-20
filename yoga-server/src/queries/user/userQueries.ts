import {CommonQueries} from "../commonQueries";

export class UserQueries {
    public static async getUserInformation(csrfToken: string, authToken: string) : Promise<any> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);
        const userInformation = {
            id: sessionAndUser.user.id,
            createdAt: sessionAndUser.user.createdAt,
            email: sessionAndUser.user.email,
            firstName: sessionAndUser.user.firstName,
            lastName: sessionAndUser.user.lastName
        };
        return userInformation;
    }
}