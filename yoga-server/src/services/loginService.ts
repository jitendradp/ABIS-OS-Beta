import {ServerInit} from "../serverInit";
import {Entry, Group, prisma} from "../generated/prisma_client";
import {UserQueries} from "../data/queries/user";
import {UserCreate} from "../data/mutations/userCreate";
import {config} from "../config";
import {Helper} from "../helper/helper";
import {RequestSynchronousService} from "./requestSynchronousService";

export class LoginService extends RequestSynchronousService {
    private static readonly bcrypt = require('bcrypt');

    get welcomeMessageContentEncodingId(): string {
        return ServerInit.loginContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group, request?:any) {
        if (!request){
            throw new Error("This service needs a request to operate on.");
        }

        const loginEntryContent: {
            email: string,
            password: string
        } = newEntry.content[ServerInit.loginContentEncoding.name];

        let foundUser = await UserQueries.findUserByEmail(loginEntryContent.email);
        if (!foundUser) {
            (<any>foundUser) = {passwordHash: ""};
        }

        const passwordsMatch = await LoginService.bcrypt.compare(loginEntryContent.password, foundUser.passwordHash);

        if (!foundUser || !passwordsMatch) {
            const validationErrors = [];
            const summary = "Couldn't login. Please check your username and password and try again.";
            this.postError(summary, validationErrors, answerChannel.id);
            return;
        }

        // TODO: Allow to switch profiles later
        const userProfiles = await prisma.agents({where:{owner: foundUser.id}});
        if (userProfiles.length < 1) {
            throw new Error(`The user with the id ${foundUser.id} that tries to login has no profile.`);
        }

        const bearerToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const session = await UserCreate.session(foundUser.id, userProfiles[0].id, bearerToken, ""); // TODO: Set client time

        Helper.log(`Setting bearer and session cookie for authenticated user.`);
        Helper.setBearerTokenCookie(bearerToken, request);
        Helper.setSessionTokenCookie(session.sessionToken, request);

        await this.postContinueTo("", answerChannel.id, {
            csrfToken: session.csrfToken
        });
    }
}