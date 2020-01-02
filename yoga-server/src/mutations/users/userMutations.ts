import {
    prisma, Session,
    SessionCreateInput, User
} from "../../generated";
import {Helpers} from "../../helper/Helpers";
import {ResponseDelay} from "../../helper/ResponseDelay";
import {Mailer} from "../../helper/Mailer";


export class UserMutations {

    private static readonly bcrypt = require('bcrypt');
    private static readonly saltRounds = 10;
    private static readonly responseDelay = 500;

    /**
     * Checks the username and password and returns a session token or 'error'.
     * @param email
     * @param password
     */
    public static async login(email: string, password: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);

        let user = await prisma.user({email: email});
        let response = "error";

        if (!user) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            return response;
        }

        if (user.challenge) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            return response;
        }

        let pwdCheckResult = await UserMutations.bcrypt.compare(password, user.password_hash);
        if (!pwdCheckResult) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            return response;
        }

        let sessions = await UserMutations.findValidSessionsForUser(user.id);
        // If the user already got a valid session then use that
        // TODO: Assign new sessions if the user logs-in with a new device
        if (sessions.length == 0) {
            response = await UserMutations.createSessionForUser(user);
        } else {
            response = sessions[0].token;
        }

        // TODO: Is it useful to wait even if the credentials are correct?
        // await delay.GetPromise();
        return response;
    }

    public static async logout(token: string): Promise<void> {
        // TODO: Implement logout()
        return new Promise(resolve => resolve());
    }

    /**
     * Creates a new user account. When the email address is already used, the owner will be notified via email.
     * @param name
     * @param email
     * @param password
     */
    public static async createUser(name: string, email: string, password: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);

        let user = await prisma.user({email: email});

        if (!user) {
            let salt = await UserMutations.bcrypt.genSalt(UserMutations.saltRounds);
            let hash = await UserMutations.bcrypt.hash(password, salt);

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
            UserMutations.sendEmailVerificationCode(user);

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
    public static async verifyEmail(code: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);
        let response = "error";

        let users = Array.from(await prisma.users({where: {challenge: code.trim()}}));
        if (users.length !== 1) {
            await delay.GetPromise();
            return response;
        }

        let user = users[0];

        // clear the challenge when the verification code was right
        prisma.updateUser({
            data: {
                challenge: null
            },
            where: {
                id: user.id
            }
        });

        let session = await UserMutations.createSessionForUser(user);

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return session;
    }

    private static async sendEmailVerificationCode(user: User): Promise<void> {
        // TODO: Use proper mail template
        return Mailer.sendMail(user.email, "Your ABIS verification code", user.challenge, user.challenge);
    }

    private static async findValidSessionsForUser(userId: string): Promise<Session[]> {
        let validUserSessions = await prisma.sessions({
            where: {
                user: {
                    id: userId
                },
                validTo_gt: new Date()
            }
        });
        return Array.from(validUserSessions);
    }

    /**
     * Creates a new session and session token for the given user.
     * @param user
     */
    private static async createSessionForUser(user): Promise<string> {
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
    public static async verifySession(token: string): Promise<boolean> {
        // TODO: Set a new session timeout
        let sessions = Array.from(await prisma.sessions({where: {token: token, validTo_gt: new Date()}}));
        return sessions.length > 0;
    }

    public static async setSessionProfile(token: string, profileId: string) {
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
        await prisma.updateUser({data: {lastUsedProfileId: profileId}, where: {id: user.id}});
        return profileId;
    }
}
