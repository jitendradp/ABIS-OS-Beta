import {ActionResponse} from "../../api/mutations/actionResponse";
import {Helper} from "../../helper/helper";
import {config} from "../../config";
import {Agent, prisma, User} from "../../generated";
import {Mailer} from "../../helper/mailer";
import {UserCreate} from "./userCreate";

export class UserMutations {
    private static readonly bcrypt = require('bcrypt');

    public static async createUser(password: string, newUser: User): Promise<ActionResponse> {
        // fact "U.P.1 Alle Benutzer müssen mind. ein Profil besitzen"
        return Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                const existingUser = await prisma.user({email: newUser.email});
                if (existingUser) {
                    throw new Error(`There is already a registered user (id: ${existingUser.id}) with the same email address: ${newUser.email}`)
                }

                // Hash the password and set it on the newUser from the parameter
                newUser.passwordSalt = await UserMutations.bcrypt.genSalt(config.auth.bcryptRounds);
                newUser.passwordHash = await UserMutations.bcrypt.hash(password, newUser.passwordSalt);

                // Create the user in the database
                let persistentUser = await prisma.createUser(newUser);

                // Set the missing fields on the newUser from the parameter
                newUser.id = persistentUser.id;
                newUser.createdAt = persistentUser.createdAt;

                // Create the first profile
                await UserMutations.createFirstProfile(newUser);

                Mailer.sendEmailVerificationCode(newUser);

                return <ActionResponse>{
                    success: true,
                    code: Helper.getRandomBase64String(8)
                };
            } catch (e) {
                const errorId = Helper.logId(`An error occurred during the creation of a new user: ${JSON.stringify(e)}`);
                return <ActionResponse>{
                    success: false,
                    code: errorId
                };
            }
        });
    }

    public static async clearChallenge(userId: string) {
        await prisma.updateUser({
            data: {
                challenge: null
            },
            where: {
                id: userId
            }
        });

        Helper.log(`Cleared the challenge for user ${userId}.`);
    }

    /**
     * Creates the first Profile-Agent for the supplied User.
     * @param user
     */
    private static async createFirstProfile(user: User): Promise<Agent> {
        if ((await prisma.user({id:user.id}).agents({where:{type:"Profile"}})).length > 0) {
            throw new Error(`This is not the first Profile of user ${user.id}.`);
        }

        return UserCreate.profile(user.id, user.firstName, "avatar.png", "Available");
    }
}
