import {Init} from "../../init";
import {DirectService} from "../../services/directService";
import {Entry, Group, prisma} from "../../generated";
import {Helper} from "../../helper/helper";
import {UserQueries} from "../../data/queries/user";
import {Channel} from "../../api/types/channel";
import {UserOwns} from "../../statements/userOwns";
import {config} from "../../config";
import {UserCreate} from "../../data/mutations/userCreate";
import {RequestSynchronousService} from "../../services/requestSynchronousService";

class Implementation extends RequestSynchronousService {
    private static readonly bcrypt = require('bcrypt');

    get welcomeMessageContentEncodingId(): string {
        return Init.loginContentEncoding.id;
    }

    async onNewChannel(newChannel:Channel) {
        if (!(await UserOwns.profile(Init.anonymousUser.id, newChannel.owner))) {
            throw new Error(`Only anonymous sessions can use this service.`);
        }

        return super.onNewChannel(newChannel);
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group, request?:any) {
        if (!request){
            throw new Error("This service needs a request to operate on.");
        }

        const loginEntryContent: {
            email: string,
            password: string
        } = newEntry.content[Init.loginContentEncoding.name];

        let foundUser = await UserQueries.findUserByEmail(loginEntryContent.email);
        if (!foundUser) {
            (<any>foundUser) = {passwordHash: ""};
        }

        const passwordsMatch = await Implementation.bcrypt.compare(loginEntryContent.password, foundUser.passwordHash);

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
            csrfToken: session.csrfToken,
            profileId: userProfiles[0].id
        });
    }
}

export const Index = {
    owner: Init.systemUser.id,
    createdBy: Init.systemUser.id,
    name: "LoginService",
    status: "Running",
    type: "Service",
    serviceDescription: "Handles the login requests of anonymous profiles",
    profileAvatar: "nologo.png",
    implementation: Implementation
};