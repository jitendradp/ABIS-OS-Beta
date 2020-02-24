import {prisma, User} from "../../generated";

export class UserQueries {
    public static findUserByEmail(email:string) : Promise<User> {
        return prisma.user({email: email});
    }
}
