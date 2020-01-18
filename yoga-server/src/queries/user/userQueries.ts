import {CommonQueries} from "../commonQueries";

export class UserQueries {
    public static async getUserInformation(csrfToken: string, authToken: string) : Promise<any> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);
        const userInformation = {
            id: sessionAndUser.user.id,
            createdAt: sessionAndUser.user.createdAt,
            email: sessionAndUser.user.email,
            firstName: sessionAndUser.user.first_name,
            lastName: sessionAndUser.user.last_name
        };
        return userInformation;
    }
}
