import {CommonQueries} from "../commonQueries";

export class AccountQueries {
    public static async getAccountInformation(csrfToken: string, authToken: string) : Promise<any> {
        const sessionAndUser = await CommonQueries.findAccountBySession(csrfToken, authToken);
        const accountInformation = {
            id: sessionAndUser.account.id,
            createdAt: sessionAndUser.account.createdAt,
            email: sessionAndUser.account.email,
            firstName: sessionAndUser.account.firstName,
            lastName: sessionAndUser.account.lastName
        };
        return accountInformation;
    }
}
