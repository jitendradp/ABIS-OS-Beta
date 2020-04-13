import {DirectService} from "../../services/directService";
import {Agent, Entry, Group, prisma} from "../../generated/prisma_client";
import {Init, Server} from "../../init";
import {UserHas} from "../../statements/userHas";
import {GetAgentOf} from "../../queries/getAgentOf";
import {AgentCreate} from "../../data/mutations/agentCreate";

class Implementation extends DirectService {
    constructor(server: Server, agent: Agent) {
        super(server, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return this.server.createRoomContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const name = newEntry.content.CreateRoom.name;
        const logo = !newEntry.content.CreateRoom.icon ? "" : newEntry.content.CreateRoom.icon;
        const isPublic = newEntry.content.CreateRoom.visibility == "Public";
        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const bearerToken = (<any>newEntry).__bearerToken;

        const userHasAuthenticatedSession = await UserHas.authenticatedSession(sessionToken, csrfToken, bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, sessionToken);

        await AgentCreate.room(Init, agentId, name, logo, isPublic);

        await this.postContinueTo("", answerChannel.id);
        prisma.deleteManyGroups({owner:this.id, memberships_every:{member:{id:agentId}}});
        prisma.deleteGroup({id:answerChannel.id});
    }
}

export const Index = {
    name: "CreateRoomService",
    status: "Running",
    type: "Service",
    serviceDescription: "Creates new rooms for agents",
    profileAvatar: "nologo.png",
    implementation: Implementation,
};