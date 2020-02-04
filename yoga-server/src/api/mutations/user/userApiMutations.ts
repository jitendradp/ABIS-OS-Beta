import {
    prisma, User
} from "../../../generated";
import {Helper} from "../../../helper/Helper";
import {Mailer} from "../../../helper/Mailer";
import {Request} from "express";
import {config} from "../../../config";
import {CommonQueries} from "../../queries/commonQueries";
import {ActionResponse} from "../actionResponse";
import {UserQueries} from "../../../queries/user";
import {SessionMutations} from "../../../mutations/session";
import {UserMutations} from "../../../mutations/user";

export class UserApiMutations {
    private static readonly bcrypt = require('bcrypt');

    /**
     * Creates a new User of type "Organization".
     */
    public static async createOrganization(
        type: string
        , email: string
        , password: string
        , timezone: string
        , organizationName: string) {
        return UserMutations.createUser(password, <User>{
            type: "Organization",
            timezone: "GMT", // TODO: Get proper user-timezone
            email: email.trim(),
            organizationName: organizationName,
            challenge: Helper.getRandomBase64String(8),
        });
    }

    /**
     * Creates a new User of type "Person".
     */
    public static async createPerson(
        type: string
        , email: string
        , password: string
        , firstName: string
        , lastName: string
        , timezone: string
        , phone?: string
        , mobilePhone?: string) {
        return UserMutations.createUser(password, <User>{
            type: "Person",
            timezone: "GMT", // TODO: Get proper user-timezone
            email: email.trim(),
            personFirstName: firstName.trim(),
            personLastName: lastName.trim(),
            personPhone: phone,
            personMobilePhone: mobilePhone,
            challenge: Helper.getRandomBase64String(8),
        });
    }

    /**
     * Checks the email verification code which is sent out to newly signed up users.
     * @param code
     * @param request
     */
    public static async verifyEmail(code: string, request: Request): Promise<ActionResponse> {
        return Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                // Get the User that has the 'code' as current 'challenge'.
                const users = await prisma.users({where: {challenge: code.trim()}});
                if (users.length != 1) {
                    throw new Error(`There is no single matching user with challenge ${code}`);
                }

                const user = users[0];

                // Clear the challenge.                     -> This allows the user to login after verification:
                await UserMutations.clearChallenge(user.id);

                // Create a Session for the User ..
                const session = await SessionMutations.createSessionForUserAndAgent(user.id);
                if (!session) {
                    throw new Error(`No session was created during the email verification for user ${user.id} although the credentials were seemingly correct.`);
                }

                // ..  and set the Session-Cookie
                Helper.setBearerTokenCookie(session.bearerToken, request);

                // Return the csrf token
                return <ActionResponse>{
                    success: true,
                    data: session.csrfToken
                };
            } catch (e) {
                Helper.logId("An error occurred during email address verification: " + JSON.stringify(e));
                return <ActionResponse>{
                    success: false,
                    data: Helper.getRandomBase64String(config.auth.tokenLength)
                };
            }
        });
    }

    /**
     * Checks the username and password and returns a session csrfToken or 'error'.
     * @param email
     * @param password
     * @param request The express request object from the yoga context
     */
    public static async login(email: string, password: string, request: Request): Promise<ActionResponse> {
        return await Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                // Find the user by email
                const user = await UserQueries.findUserByEmail(email);
                if (!user) {
                    throw new Error(`An unknown User tried to login with the email address '${email}'.`);
                }

                // Check if the user's account doesn't have any pending challenges
                if (user.challenge) {
                    // TODO: Don't allow spam with this and only send reminders in intervals of ca. 30 min.
                    // Send another email verification message to remind the user
                    // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
                    Mailer.sendEmailVerificationCode(user);
                    throw new Error(`User ${user.id} tried to login but the account is still locked by an unsolved challenge.`);
                }

                // Check the password
                const pwdCheckResult = await UserApiMutations.bcrypt.compare(password, user.passwordHash);
                if (!pwdCheckResult) {
                    throw new Error(`User ${user.id} tried to login with an invalid password.`);
                }

                // Create a new session
                const session = await SessionMutations.createSessionForUserAndAgent(user.id);
                if (!session) {
                    throw new Error(`No session was created during the login for user ${user.id} although the credentials were seemingly correct.`);
                }

                // When the session was created, set the session cookie
                Helper.log(`New session for User ${user.id}.`);
                Helper.setBearerTokenCookie(session.bearerToken, request);
                Helper.log(`User ${user.id} logged in.`);

                return <ActionResponse>{
                    success: true,
                    data: session.csrfToken
                };
            } catch (e) {
                Helper.logId(`An error occurred during login: ${JSON.stringify(e)}`);
                return <ActionResponse>{
                    success: false,
                    data: Helper.getRandomBase64String(config.auth.tokenLength)
                };
            }
        });
    }

    public static async logout(csrfToken: string, bearerToken: string, request: Request): Promise<ActionResponse> {
        return Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                const sessionAndUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
                if (!sessionAndUser) {
                    return <ActionResponse>{
                        success: false
                    };
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

                Helper.clearBearerTokenCookie(request);

                return <ActionResponse>{
                    success: true,
                    code: Helper.getRandomBase64String(8)
                };
            } catch (e) {
                const errorId = Helper.logId(`An error occurred during logout: ${JSON.stringify(e)}`);
                return <ActionResponse>{
                    success: false,
                    code: errorId
                };
            }
        });
    }

    /**
     * Verifies if the supplied tokens represent a valid session.
     * @param csrfToken
     * @param bearerToken
     * @param request
     */
    public static async verifySession(csrfToken: string, bearerToken: string, request: Request): Promise<ActionResponse> {
        return Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                return <ActionResponse>{
                    success: await SessionMutations.verifySession(csrfToken, bearerToken),
                    code: Helper.getRandomBase64String(8)
                }
            } catch (e) {
                const errorId = Helper.logId(`An error occurred during logout: ${JSON.stringify(e)}`);
                return <ActionResponse>{
                    success: false,
                    code: errorId
                };
            }
        });
    }
}
