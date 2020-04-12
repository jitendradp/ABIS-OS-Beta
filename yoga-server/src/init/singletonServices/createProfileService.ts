import {DirectService} from "../../services/directService";
import {Agent, Entry, Group, prisma, User} from "../../generated/prisma_client";
import {Channel} from "../../api/types/channel";
import {UserOwns} from "../../statements/userOwns";
import {Helper} from "../../helper/helper";
import {ActionResponse} from "../../api/mutations/actionResponse";
import {config} from "../../config";
import {Mailer} from "../../helper/mailer";
import {UserCreate} from "../../data/mutations/userCreate";
import {Init, Server} from "../../init";
import {UserHas} from "../../statements/userHas";
import {UserQueries} from "../../data/queries/user";
import {GetUserOf} from "../../queries/getUserOf";

class Implementation extends DirectService {
    constructor(server:Server, agent:Agent) {
        super(server, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return this.server.createProfileContentEncoding.id;
    }

    async onNewEntry(newEntry:Entry, answerChannel:Group) {
        var profile_name = newEntry.content.CreateProfile.profile_name;
        var csrfToken = (<any>newEntry).__csrfToken;
        var sessionToken = (<any>newEntry).__sessionToken;
        var bearerToken = (<any>newEntry).__bearerToken;

        const userHasAuthenticatedSession = await UserHas.authenticatedSession(sessionToken, csrfToken, bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const userId = await  GetUserOf.session((<any>newEntry).__csrfToken, (<any>newEntry).__sessionToken);
        if (!userId) {
            throw new Error(`Couldn't authenticate the request.`);
        }
        await UserCreate.profile(userId, profile_name, "avatar.png", "Available", Init);

        await this.postContinueTo("", answerChannel.id);
    }
}

export const Index = {
    name: "CreateProfileService",
    status: "Running",
    type: "Service",
    serviceDescription: "Creates new profiles for users",
    profileAvatar: "nologo.png",
    implementation: Implementation,
};