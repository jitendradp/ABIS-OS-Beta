import {
    prisma,
    SessionCreateInput, User
} from "../../generated";
import {Helpers} from "../../helper/Helpers";
import {ResponseDelay} from "../../helper/ResponseDelay";
import {Mailer} from "../../helper/Mailer";

const bcrypt = require('bcrypt');
const saltRounds = 10;

export class UserMutations {
    /**
     * Checks the username and password and returns a session token or 'error'.
     * @param email
     * @param password
     */
    public async login(email:string, password:string) : Promise<string> {
        let delay = new ResponseDelay(500);

        let user = await prisma.user({email: email});
        let response = "error";

        if (user) {
            let pwdCheckResult = await bcrypt.compare(password, user.password_hash);
            if (pwdCheckResult) {
                response = await this.createSessionForUser(user);
            }
        }

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return response;
    }

    public async logout(token: string) : Promise<void> {
        // TODO: Implement logout()
        return new Promise(resolve => resolve());
    }

    /**
     * Creates a new user account. When the email address is already used, the owner will be notified via email.
     * @param name
     * @param email
     * @param password
     */
    public async createUser(name: string, email: string, password: string) : Promise<string> {
        let delay = new ResponseDelay(500);

        let user = await prisma.user({email: email});

        if (!user) {
            let salt = await bcrypt.genSalt(saltRounds);
            let hash = await bcrypt.hash(password, salt);

            let user = <User>{
                email: email.trim(),
                name: name.trim(),
                is_verified: false,
                challenge: Helpers.getRandomBase64String(8),
                password_hash: hash,
                password_salt: salt,
                timezone: "GMT" // TODO: Get proper user-timezone
            };
            let userid = await prisma.createUser(user).id();
            this.sendEmailVerificationCode(user);

            console.log("Created new user " + userid);
        } else {
            console.log("Tried to re-signup user " + user.id + ". Sending a notification mail to the account owner.");

            // TODO: Use proper mail template
            // Fire and forget to not slow up the response time
            Mailer.sendMail(email, "Abis account reminder", "Hello World!", "Hello World!");
        }

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return "ok";
    }

    /**
     * Checks the email verification code which is sent out to newly signed up accounts.
     * @param code
     */
    public async verifyEmail(code: string) : Promise<string> {
        let delay = new ResponseDelay(500);

        let users = Array.from(await prisma.users({where: {challenge: code.trim()}}));
        if (users.length === 0) {
            throw new Error("Invalid code");
        }
        let user = users[0];
        let session = await this.createSessionForUser(user);

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return session;
    }

    private async sendEmailVerificationCode(user: User) : Promise<void> {
        // TODO: Use proper mail template
        return Mailer.sendMail(user.email, "Your ABIS verification code", user.challenge, user.challenge);
    }

    /**
     * Creates a new session and session token for the given user.
     * @param user
     */
    private async createSessionForUser(user) : Promise<string> {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        let len = 64;
        let randomNumbers = Helpers.getRandomBase64String(len);

        var session = <SessionCreateInput>{
            timedOut: null,
            token: randomNumbers,
            validTo: tomorrow,
            user: {
                connect: {
                    id: user.id
                }
            },
            profile: null
        };
        await prisma.createSession(session);

        return randomNumbers;
    }

    /**
     * Verifies if a session token exists and is valid.
     * @param token
     */
    public async verifySession(token: string) : Promise<boolean> {
        // TODO: Set a new session timeout
        let session = await prisma.session({token: token}).user();
        if (!session) {
            return false;
        }
        return true;
    }

    public async setSessionProfile(token: string, profileId: string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        await prisma.updateSession({
            data: {
                profile: {
                    connect: {id: profileId}
                }
            },
            where: {
                token: token
            }
        });
        await prisma.updateUser({data:{lastUsedProfileId:profileId}, where:{id:user.id}});
        return profileId;
    }
}
