import {CommonQueries} from "../commonQueries";

export class AccountQueries {
    public static async getAccountInformation(csrfToken: string, authToken: string) : Promise<any> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);
        const accountInformation = {
            id: sessionAndUser.user.id,
            createdAt: sessionAndUser.user.createdAt,
            email: sessionAndUser.user.email,
            name: sessionAndUser.user.name
        };
        return accountInformation;
    }
}
