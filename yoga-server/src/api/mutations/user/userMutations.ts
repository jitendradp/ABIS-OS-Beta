import {
    Location,
    prisma, SessionCreateInput, User
} from "../../../generated";
import {Helpers} from "../../../helper/Helpers";
import {ResponseDelay} from "../../../helper/ResponseDelay";
import {Mailer} from "../../../helper/Mailer";
import {Request} from "express";
import {config} from "../../../config";
import {CommonQueries} from "../../queries/commonQueries";
import {ActionResponse} from "../actionResponse";

export type AddTagInput = {
    type:string,
    value:string
};
export type CreateLocationInput = {
    type: string,
    name: string,

    // Only if "type == LocationType.OpenStreetMap":
    osmNodeId?: string,

    // Only if "type == LocationType.Address":
    addressLine1?: string,
    addressLine2?: string,
    addressCity?: string,
    addressZipCode?: string,
    addressCountry?: string,

    // Only if "type == LocationType.GeoPoint":
    geoPointLatitude?: number,
    geoPointLongitude?: number,
    geoPointRadiusMeter?: number,

    tags: [AddTagInput]
};
export type TokenPair = { bearerToken: string, csrfToken: string };

export class UserMutations {

    private static readonly bcrypt = require('bcrypt');

    /**
     * Checks the username and password and returns a session csrfToken or 'error'.
     * @param email
     * @param password
     * @param request The express request object from the yoga context
     */
    public static async login(email: string, password: string, request: Request): Promise<ActionResponse> {
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);
        let actionResponse: ActionResponse = null;

        const user = await prisma.user({email: email});
        if (!user) {
            actionResponse = this.softAbortInvalidRequest("User " + email + " is unknown.");
        }

        if (!actionResponse && user.challenge) {
            // Send another email verification message to remind the user
            // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
            Mailer.sendEmailVerificationCode(user);
            actionResponse = this.softAbortInvalidRequest("User " + user.id + " tried to log-in before verifying the email address.");
        }

        const pwdCheckResult = await UserMutations.bcrypt.compare(password, user.passwordHash);
        if (!actionResponse && !pwdCheckResult) {
            actionResponse = this.softAbortInvalidRequest("User " + user.id + " tried to log-in with an invalid password.");
        }

        let tokenPair:TokenPair = null;
        if (!actionResponse) {
            try {
                tokenPair = await UserMutations.createSessionForUser(user.id);
            } catch (e) {
                actionResponse = this.softAbortInvalidRequest("Couldn't create a session for the following reason: " + JSON.stringify(e));
            }
        }

        if (!tokenPair) {
            actionResponse = this.softAbortInvalidRequest("The token pair for the session wasn't generated.");
        }

        if (!actionResponse) {
            try {
                UserMutations.setBearerTokenCookie(tokenPair.bearerToken, request);
            } catch (e) {
                actionResponse = this.softAbortInvalidRequest("Couldn't create a session for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            actionResponse = <ActionResponse>{
                success: true,
                data: tokenPair.csrfToken
            };
        }

        await delay.GetPromise();
        return actionResponse;
    }

    public static async logout(csrfToken: string, bearerToken: string, request: Request): Promise<ActionResponse> {
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

        this.clearBearerTokenCookie(request);

        return <ActionResponse>{
            success: true
        };
    }

    /**
     * Checks the email verification code which is sent out to newly signed up users.
     * @param code
     * @param request
     */
    public static async verifyEmail(code: string, request: Request): Promise<ActionResponse> {
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);

        const users = await prisma.users({where: {challenge: code.trim()}});
        if (users.length !== 1) {
            const errorId = this.abortInvalidRequest("Found no matching user for the specified email verification code " + code + ".", false);
            let response = <ActionResponse> {
                success: false,
                code: errorId,
                message: "The verification failed."
            };
            await delay.GetPromise();
            return response;
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

        const session = await UserMutations.createSessionForUser(user.id);
        UserMutations.setBearerTokenCookie(session.bearerToken, request);

        let response = <ActionResponse> {
            success: true,
            data: session.csrfToken,
            message: "The verification was successful. This response contains the CSRF-Token. Store it somewhere and send it with every following api request."
        };

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();
        return response;
    }

    /**
     * Verifies if a session csrfToken exists and is valid.
     * @param csrfToken
     * @param bearerToken
     * @param request
     */
    public static async verifySession(csrfToken: string, bearerToken: string, request: Request): Promise<ActionResponse> {
        const session = await CommonQueries.findSession(csrfToken, bearerToken);
        const isValid = !!session;
        return <ActionResponse>{
            success: isValid
        };
    }

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
            challenge: Helpers.getRandomBase64String(8),
        });
    }

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
            challenge: Helpers.getRandomBase64String(8),
        });
    }


    private static abortInvalidRequest(msg: string, _throw?:boolean) : string {
        const logId = Helpers.logId(msg);
        if (_throw) {
            throw "Invalid request. Error id: " + logId;
        }
        return logId;
    }

    private static softAbortInvalidRequest(msg: string) : ActionResponse {
        const errorId = this.abortInvalidRequest(msg, false);
        return <ActionResponse>{
            success: false,
            code: errorId
        };
    }

    /**
     * Creates a new session and session csrfToken for the given user.
     * @param userId
     * @param agentId
     */
    private static async createSessionForUser(userId: string, agentId?: string): Promise<TokenPair> {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const csrfToken = Helpers.getRandomBase64String(config.auth.tokenLength);
        const bearerToken = Helpers.getRandomBase64String(config.auth.tokenLength);

        if (!agentId) {
            agentId = await UserMutations.getFirstAgentOfUser(userId);
        }
        if (!agentId) {
            throw new Error("Couldn't find a default agent for user id '" + userId + "'.");
        }

        const session = <SessionCreateInput>{
            timedOut: null,
            csrfToken: csrfToken,
            bearerToken: bearerToken,
            validTo: tomorrow,
            user: {
                connect: {
                    id: userId
                }
            },
            agent: {
                connect: {
                    id: agentId
                }
            }
        };

        await prisma.createSession(session);

        return {
            bearerToken,
            csrfToken
        };
    }

    private static async getFirstAgentOfUser(userId:string) : Promise<string> {
        const firstAgent = await prisma.agents({where:{owner:userId},orderBy: "createdAt_ASC",first:1});
        return firstAgent[0].id;
    }

    private static setBearerTokenCookie(bearerToken: string, request: Request) {
        request.res.cookie('bearerToken', bearerToken, {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    private static clearBearerTokenCookie(request: Request) {
        request.res.cookie('bearerToken', "", {
            maxAge: 0,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    private static async createUser(password:string, newUserData:User) {
        let actionResponse: ActionResponse = null;
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);

        let user = await prisma.user({email: newUserData.email});
        if (user) {
            actionResponse = this.softAbortInvalidRequest("There is already a registered user with the email address: " + newUserData.email);

            // noinspection ES6MissingAwait - Fire and forget to not block the request
            Mailer.sendUserReminder(user);
        }

        if (!actionResponse) {
            try {
                const salt = await UserMutations.bcrypt.genSalt(config.auth.bcryptRounds);
                const hash = await UserMutations.bcrypt.hash(password, salt);

                user.id = null;
                user.passwordSalt = salt;
                user.passwordHash = hash;

                let created = await prisma.createUser(user);

                user.id = created.id;
                user.createdAt = created.createdAt;

                Helpers.log("Created a new user (id: " + user.id + ") for email address: " + user.email);

                // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
                Mailer.sendEmailVerificationCode(user);

                await UserMutations.createUser(password, newUserData);
            } catch (e) {
                actionResponse = this.softAbortInvalidRequest("Couldn't create a user for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            actionResponse = <ActionResponse>{
                success: true,
                data: user.id
            };
        }

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();
        return actionResponse;
    }
}
