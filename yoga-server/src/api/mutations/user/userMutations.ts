import {
    prisma, Session, User
} from "../../../generated";
import {Helpers} from "../../../helper/Helpers";
import {ResponseDelay} from "../../../helper/ResponseDelay";
import {Mailer} from "../../../helper/Mailer";
import {Request} from "express";
import {config} from "../../../config";
import {CommonQueries} from "../../queries/commonQueries";
import {ActionResponse} from "../actionResponse";

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

        let user:User = null;
        try {
            user = await prisma.user({email: email});
        } catch (e) {
            actionResponse = Helpers.softAbortInvalidRequest("Couldn't find a user during login for the following reason: " + JSON.stringify(e));
        }

        if (!user) {
            actionResponse = Helpers.softAbortInvalidRequest("User " + email + " is unknown.");
        }

        if (!actionResponse && user.challenge) {
            // TODO: Don't allow spam with this and only send reminders in intervals of ca. 30 min.
            // Send another email verification message to remind the user
            // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
            Mailer.sendEmailVerificationCode(user);
            actionResponse = Helpers.softAbortInvalidRequest("User " + user.id + " tried to log-in before verifying the email address.");
        }

        let pwdCheckResult: boolean;
        if (!actionResponse) {
            pwdCheckResult = await UserMutations.bcrypt.compare(password, user.passwordHash);
        }

        if (!actionResponse && !pwdCheckResult) {
            actionResponse = Helpers.softAbortInvalidRequest("User " + user.id + " tried to log-in with an invalid password.");
        }

        let session:Session = null;
        if (!actionResponse) {
            try {
                session = await UserMutations.createSessionForUser(user.id);
            } catch (e) {
                actionResponse = Helpers.softAbortInvalidRequest("Couldn't create a session for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse && !session) {
            actionResponse = Helpers.softAbortInvalidRequest("No session was generated during login attempt of user " + user.id + ".");
        }

        if (!actionResponse) {
            Helpers.log("Created a new session for user (id: " + user.id + ") and agent (id: " +  + ").");
            try {
                UserMutations.setBearerTokenCookie(session.bearerToken, request);
            } catch (e) {
                actionResponse = Helpers.softAbortInvalidRequest("Couldn't create a session for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            actionResponse = <ActionResponse>{
                success: true,
                data: session.csrfToken
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
            const errorId = Helpers.abortInvalidRequest("Found no matching user for the specified email verification code " + code + ".", false);
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

        Helpers.log("The e-mail address of user '" + user.id + "' is now verified.");

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

    /**
     * Creates a new session and session csrfToken for the given user.
     * @param userId
     * @param agentId
     */
    private static async createSessionForUser(userId: string, agentId?: string): Promise<Session> {
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

        const session = await prisma.createSession({
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
        });

        return session;
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

    private static async createFirstProfile(user:User) {
        const newProfile = await prisma.createAgent({
            owner: user.id,
            createdBy: user.id,
            name: user.personFirstName + "'s Profile",
            profileAvatar: "/assets/logos/abis-logo.png",
            status: "Offline",
            type: "Profile"
        });
        await prisma.updateUser({where:{id:user.id}, data: {
            agents: {
                connect: {
                    id: newProfile.id
                }
            }
        }});
        return newProfile;
    }

    private static async createUser(password:string, newUser:User) {
        let actionResponse: ActionResponse = null;
        const delay = new ResponseDelay(config.auth.normalizedResponseTime);

        let existingUser = await prisma.user({email: newUser.email});
        if (existingUser) {
            // noinspection ES6MissingAwait - Fire and forget to not block the request
            Mailer.sendUserReminder(existingUser);
            actionResponse = Helpers.softAbortInvalidRequest("There is already a registered user with the email address: " + existingUser.email);
        }

        if (!actionResponse) {
            try {
                const salt = await UserMutations.bcrypt.genSalt(config.auth.bcryptRounds);
                const hash = await UserMutations.bcrypt.hash(password, salt);

                newUser.passwordSalt = salt;
                newUser.passwordHash = hash;

                let created = await prisma.createUser(newUser);
                newUser.id = created.id;
                newUser.createdAt = created.createdAt;

                Helpers.log("Created a new user (id: " + newUser.id + ").");
            } catch (e) {
                actionResponse = Helpers.softAbortInvalidRequest("Couldn't create a new user for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            try {
                Helpers.log("Sending account verification email to a new user (id: " + newUser.id + ").");
                // noinspection ES6MissingAwait Should run in async fire and forget style so that it doesn't slow up the main logic
                Mailer.sendEmailVerificationCode(newUser);
            } catch (e) {
                actionResponse = Helpers.softAbortInvalidRequest("Couldn't send a verfication mail to a new user for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            try {
                // Create the first profile of the new user
                await this.createFirstProfile(newUser);
            } catch (e) {
                actionResponse = Helpers.softAbortInvalidRequest("Couldn't create the first profile for a new user (id:" + newUser.id + ") for the following reason: " + JSON.stringify(e));
            }
        }

        if (!actionResponse) {
            actionResponse = <ActionResponse>{
                success: true,
                data: newUser.id
            };
        }

        // Wait some time before returning the response (500ms - runtime)
        await delay.GetPromise();
        return actionResponse;
    }
}
