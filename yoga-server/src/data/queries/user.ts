import {prisma, User} from "../../generated";

export class UserQueries {
    public static findUserByEmail(email:string) : Promise<User> {
        return prisma.user({email: email});
    }
    public static async findUserByChallenge(challenge:string) : Promise<User> {
        const foundUsers = await prisma.users({where:{challenge: challenge}});
        if (foundUsers.length > 1) {
            throw new Error(`There is more than one user with the same challenge: ${challenge}`)
        }
        return foundUsers.length == 1
            ? foundUsers[0]
            : null;
    }
}
