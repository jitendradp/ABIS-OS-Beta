import {
    prisma, Session,
    SessionCreateInput, User
} from "../../generated";
import {Helpers} from "../../helper/Helpers";
import {ResponseDelay} from "../../helper/ResponseDelay";
import {Mailer} from "../../helper/Mailer";
import {Request} from "express";
import {config} from "../../config";

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
                validTo_gt: new Date(),
                timedOut:null
            }
        });
        return Array.from(validUserSessions);
    }

    private static async findUserByToken(authToken:string) : Promise<User> {
        let sessions = await prisma.sessions({where: {authToken: authToken, validTo_gt: new Date(), timedOut:null}});
        if (sessions.length > 1) {
            this.abortInvalidRequest(" --- Take a gun and shoot yourself! --- There is more than one session with the same csrfToken: " + authToken);
        }
        if (sessions.length == 0) {
            return null;
        }

        let user = await prisma.session({authToken:authToken}).user();
        if (!user) {
            this.abortInvalidRequest(" --- Take a gun and shoot yourself! --- There is no associated user for session " + authToken);
        }

        // TODO: Set a new session timeout
        return user;
    }

    /**
     * Creates a new session and session csrfToken for the given user.
     * @param user
     */
    private static async createSessionForUser(user): Promise<{authToken:string, csrfToken:string}> {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        let len = 64;
        let csrfToken = Helpers.getRandomBase64String(len);
        let authToken = Helpers.getRandomBase64String(len);

        const session = <SessionCreateInput>{
            timedOut: null,
            csrfToken: csrfToken,
            authToken: authToken,
            validTo: tomorrow,
            user: {
                connect: {
                    id: user.id
                }
            },
            profile: null
        };
        await prisma.createSession(session);

        return {
            authToken,
            csrfToken
        };
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
     * Checks the username and password and returns a session csrfToken or 'error'.
     * @param email
     * @param password
     * @param request The express request object from the yoga context
     */
    public static async login(email: string, password: string, request:Request): Promise<string> {
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
        let session = sessions.length == 0 ? await UserMutations.createSessionForUser(user) : sessions[0];

        UserMutations.setAuthTokenCookie(session.authToken, request);

        return session.csrfToken;
    }

    private static setAuthTokenCookie(authToken:string, request:Request) {
        request.res.cookie('authToken', authToken, {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    private static clearAuthTokenCookie(request:Request) {
        request.res.cookie('authToken', "", {
            maxAge: 0,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    public static async logout(authToken: string, request:Request): Promise<boolean> {
        let user = await this.findUserByToken(authToken);
        if (!user) {
            return false;
        }

        let validSessions = await prisma.sessions({where:{user:{id:user.id}, validTo_gt: new Date(), timedOut:null}});

        await Promise.all(
            validSessions.map(async o =>
                await prisma.updateSession({
                    where:{
                        id:o.id
                    },
                    data:{
                        timedOut:new Date()
                    }
                })));

        this.clearAuthTokenCookie(request);

        return true;
    }

    /**
     * Checks the email verification code which is sent out to newly signed up accounts.
     * @param code
     */
    public static async verifyEmail(code: string, request:Request): Promise<string> {
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
        UserMutations.setAuthTokenCookie(session.authToken, request);

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();

        return session.csrfToken;
    }

    /**
     * Verifies if a session csrfToken exists and is valid.
     * @param csrfToken
     * @param authToken
     * @param request
     */
    public static async verifySession(csrfToken: string, authToken: string, request:Request): Promise<boolean> {
        // TODO: Set a new session timeout
        let sessions = await prisma.sessions({
            where: {
                csrfToken: csrfToken,
                authToken: authToken,
                validTo_gt: new Date(),
                timedOut:null
            }});

        if (sessions.length > 0) {
            UserMutations.setAuthTokenCookie(authToken, request);
        }

        return sessions.length > 0;
    }

    public static async setSessionProfile(csrfToken: string, authToken:string, profileId: string) {
        let user = await this.findUserByToken(authToken);

        if (user == null) {
            this.abortInvalidRequest("Couldn't find a valid session for csrfToken: " + authToken);
        }

        await prisma.updateSession({
            data: {
                profile: {
                    connect: {id: profileId}
                }
            },
            where: {
                authToken: authToken
            }
        });

        await prisma.updateUser({data: {lastUsedProfileId: profileId}, where: {id: user.id}});

        return profileId;
    }
}
