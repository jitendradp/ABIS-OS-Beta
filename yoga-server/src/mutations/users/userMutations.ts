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

    private static abortInvalidRequest(msg:string) {
        let logId = Helpers.logId(msg);
        throw "Invalid request. Error id: " + logId;
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

    private static async findUserByToken(token:string) : Promise<User> {
        let sessions = await prisma.sessions({where: {token: token, validTo_gt: new Date()}});
        if (sessions.length > 1) {
            this.abortInvalidRequest(" --- Take a gun and shoot yourself! --- There is more than one session with the same token: " + token);
        }
        if (sessions.length == 0) {
            return null;
        }

        let user = await prisma.session({token:token}).user();
        if (!user) {
            this.abortInvalidRequest(" --- Take a gun and shoot yourself! --- There is no associated user for session " + token);
        }

        // TODO: Set a new session timeout
        return user;
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

        const session = <SessionCreateInput>{
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
     * Creates a new user account. When the email address is already used, the owner will be notified via email.
     * @param name
     * @param email
     * @param password
     */
    public static async createUser(name: string, email: string, password: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);

        let user = await prisma.user({email: email});
        if (user) {
            Mailer.sendAccountReminder(user);
            await delay.GetPromise();
            this.abortInvalidRequest("There is already a registered account with the email address: " + email);
        }

        let salt = await UserMutations.bcrypt.genSalt(UserMutations.saltRounds);
        let hash = await UserMutations.bcrypt.hash(password, salt);

        user = <User>{
            email: email.trim(),
            name: name.trim(),
            is_verified: false,
            challenge: Helpers.getRandomBase64String(8),
            password_hash: hash,
            password_salt: salt,
            timezone: "GMT" // TODO: Get proper user-timezone
        };

        user.id = await prisma.createUser(user).id();
        Helpers.log("Created a new account (id: " + user.id + ") for email address: " + email);

        // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
        Mailer.sendEmailVerificationCode(user);

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return "ok";
    }

    /**
     * Checks the username and password and returns a session token or 'error'.
     * @param email
     * @param password
     */
    public static async login(email: string, password: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);
        let user = await prisma.user({email: email});

        if (!user) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            this.abortInvalidRequest("User " + email + " is unknown.");
        }

        if (user.challenge) {
            // Send another email verification message to remind the user
            // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
            Mailer.sendEmailVerificationCode(user);

            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            this.abortInvalidRequest("User " + user.id + " tried to log-in before verifying the email address.");
        }

        let pwdCheckResult = await UserMutations.bcrypt.compare(password, user.password_hash);
        if (!pwdCheckResult) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            this.abortInvalidRequest("User " + user.id + " tried to log-in with an invalid password.");
        }

        // If the user already got a valid session then use that
        // TODO: Assign new sessions if the user logs-in with a new device
        let sessions = await UserMutations.findValidSessionsForUser(user.id);

        // TODO: Is it useful to wait even if the credentials are correct?
        // await delay.GetPromise();
        if (sessions.length == 0) {
            return await UserMutations.createSessionForUser(user);
        } else {
            return sessions[0].token;
        }
    }

    public static async logout(token: string): Promise<void> {
        // TODO: Implement logout()
        return new Promise(resolve => resolve());
    }

    /**
     * Checks the email verification code which is sent out to newly signed up accounts.
     * @param code
     */
    public static async verifyEmail(code: string): Promise<string> {
        let delay = new ResponseDelay(UserMutations.responseDelay);

        let users = Array.from(await prisma.users({where: {challenge: code.trim()}}));
        if (users.length !== 1) {
            await delay.GetPromise();
            this.abortInvalidRequest("Found no matching user for the specified email verification code " + code + ".");
        }

        let user = users[0];

        // clear the challenge when the verification code was right
        await prisma.updateUser({
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
        let user = await this.findUserByToken(token);

        if (user == null) {
            this.abortInvalidRequest("Couldn't find a valid session for token: " + token);
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
