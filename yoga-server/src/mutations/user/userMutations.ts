import {
    prisma, SessionCreateInput, User
} from "../../generated";
import {Helpers} from "../../helper/Helpers";
import {ResponseDelay} from "../../helper/ResponseDelay";
import {Mailer} from "../../helper/Mailer";
import {Request} from "express";
import {config} from "../../config";
import {CommonQueries} from "../../queries/commonQueries";

export class UserMutations {

    private static readonly bcrypt = require('bcrypt');

    private static abortInvalidRequest(msg: string) {
        const logId = Helpers.logId(msg);
        throw "Invalid request. Error id: " + logId;
    }

    /**
     * Creates a new session and session csrfToken for the given user.
     * @param user
     */
    private static async createSessionForUser(user: User): Promise<{ authToken: string, csrfToken: string }> {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const csrfToken = Helpers.getRandomBase64String(config.auth.tokenLength);
        const authToken = Helpers.getRandomBase64String(config.auth.tokenLength);

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
     * Creates a new user user. When the email address is already used, the owner will be notified via email.
     * @param name
     * @param email
     * @param password
     */
    public static async createUser(firstName: string, lastName: string, email: string, password: string): Promise<string> {
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);

        let user = await prisma.user({email: email});
        if (user) {
            // noinspection ES6MissingAwait - Fire and forget to not block the request
            Mailer.sendUserReminder(user);
            await delay.GetPromise();
            this.abortInvalidRequest("There is already a registered user with the email address: " + email);
        }

        const salt = await UserMutations.bcrypt.genSalt(config.auth.bcryptRounds);
        const hash = await UserMutations.bcrypt.hash(password, salt);

        user = <User>{
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            isVerified: false,
            challenge: Helpers.getRandomBase64String(8),
            passwordHash: hash,
            passwordSalt: salt,
            timezone: "GMT" // TODO: Get proper user-timezone
        };

        user.id = await prisma.createUser(user).id();
        Helpers.log("Created a new user (id: " + user.id + ") for email address: " + email);

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
    public static async login(email: string, password: string, request: Request): Promise<string> {
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);
        const user = await prisma.user({email: email});

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

        const pwdCheckResult = await UserMutations.bcrypt.compare(password, user.passwordHash);
        if (!pwdCheckResult) {
            // Wait some time before returning the response (500ms - runtime)
            await delay.GetPromise();
            this.abortInvalidRequest("User " + user.id + " tried to log-in with an invalid password.");
        }

        // If the user already got a valid session then use that
        // TODO: Assign new sessions if the user logs-in with a new device
        const sessions = await CommonQueries.findUserSessions(user.id);

        // TODO: Is it useful to wait even if the credentials are correct?
        // await delay.GetPromise();
        const session = sessions.length == 0 ? await UserMutations.createSessionForUser(user) : sessions[0];

        UserMutations.setAuthTokenCookie(session.authToken, request);

        return session.csrfToken;
    }

    private static setAuthTokenCookie(authToken: string, request: Request) {
        request.res.cookie('authToken', authToken, {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    private static clearAuthTokenCookie(request: Request) {
        request.res.cookie('authToken', "", {
            maxAge: 0,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    public static async logout(csrfToken: string, authToken: string, request: Request): Promise<boolean> {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!sessionAndUser) {
            return false;
        }

        const validSessions = await CommonQueries.findUserSessions(sessionAndUser.user.id);

        await Promise.all(
            validSessions.map(async o =>
                await prisma.updateSession({
                    where: {
                        id: o.id
                    },
                    data: {
                        loggedOut: new Date()
                    }
                })));

        this.clearAuthTokenCookie(request);

        return true;
    }

    /**
     * Checks the email verification code which is sent out to newly signed up users.
     * @param code
     * @param request
     */
    public static async verifyEmail(code: string, request: Request): Promise<string> {
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);

        const users = await prisma.users({where: {challenge: code.trim()}});
        if (users.length !== 1) {
            await delay.GetPromise();
            this.abortInvalidRequest("Found no matching user for the specified email verification code " + code + ".");
        }

        const user = users[0];

        // clear the challenge when the verification code was right
        await prisma.updateUser({
            data: {
                challenge: null
            },
            where: {
                id: user.id
            }
        });

        const session = await UserMutations.createSessionForUser(user);
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
    public static async verifySession(csrfToken: string, authToken: string, request: Request): Promise<boolean> {
        // TODO: Set a new session timeout
        const session = await CommonQueries.findSession(csrfToken, authToken);
        return !!session;
    }

    public static async setSessionProfile(csrfToken: string, authToken: string, profileId: string) {
        const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, authToken);

        if (sessionAndUser == null) {
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

        await prisma.updateUser({data: {lastUsedProfile: profileId}, where: {id: sessionAndUser.user.id}});

        return profileId;
    }
}
