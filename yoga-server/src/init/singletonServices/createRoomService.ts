import {DirectService} from "../../services/directService";
import {Init, Server} from "../../init";
import {UserHas} from "../../statements/userHas";
import {GetAgentOf} from "../../queries/getAgentOf";
import {AgentCreate} from "../../data/mutations/agentCreate";
import {Agent, Entry, Group, prisma} from "../../generated";
import {Channel} from "../../api/types/channel";

class Implementation extends DirectService {
    constructor(server: Server, agent: Agent) {
        super(server, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return this.server.createRoomContentEncoding.id;
    }

    async onAfterReverseChannelCreated(newChannel:Channel, reverseChannel: Group) : Promise<boolean> {
        const csrfToken = (<any>newChannel).__csrfToken;
        const sessionToken = (<any>newChannel).__sessionToken;
        const bearerToken = (<any>newChannel).__bearerToken;

        const userHasAuthenticatedSession = await UserHas.authenticatedSession(sessionToken, csrfToken, bearerToken);
        if (!userHasAuthenticatedSession) {
            this.postError("You're not logged in or have not enough rights to create this room.", [], reverseChannel.id);
            return false;
        }
        return true;
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
            this.postError("You're not logged in or have not enough rights to create this room.", [], answerChannel.id);
            return;
        }

        const agentId = await GetAgentOf.session(csrfToken, sessionToken);

        await AgentCreate.room(Init, agentId, name, logo, isPublic);

        await this.postContinueTo("", answerChannel.id);
        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
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