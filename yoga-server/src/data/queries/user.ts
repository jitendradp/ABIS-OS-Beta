import {prisma, User} from "../../generated/prisma_client";

export class UserQueries {
    public static findUserByEmail(email:string) : Promise<User> {
        return prisma.user({email: email});
    }
}
