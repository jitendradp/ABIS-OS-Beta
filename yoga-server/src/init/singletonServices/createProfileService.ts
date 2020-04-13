import {DirectService} from "../../services/directService";

import {UserCreate} from "../../data/mutations/userCreate";
import {Init, Server} from "../../init";
import {UserHas} from "../../statements/userHas";
import {GetUserOf} from "../../queries/getUserOf";
import {GetAgentOf} from "../../queries/getAgentOf";
import {Agent, Entry, Group, prisma} from "../../generated";

class Implementation extends DirectService {
    constructor(server: Server, agent: Agent) {
        super(server, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return this.server.createProfileContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const profile_name = newEntry.content.CreateProfile.profile_name;
        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const bearerToken = (<any>newEntry).__bearerToken;

        const userHasAuthenticatedSession = await UserHas.authenticatedSession(sessionToken, csrfToken, bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, sessionToken);
        const userId = await GetUserOf.session((<any>newEntry).__csrfToken, (<any>newEntry).__sessionToken);
        if (!userId) {
            throw new Error(`Couldn't authenticate the request.`);
        }
        await UserCreate.profile(userId, profile_name, "avatar.png", "Available", Init);

        await this.postContinueTo("", answerChannel.id);
        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
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