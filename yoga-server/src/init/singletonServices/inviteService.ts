import {DirectService} from "../../services/directService";
import {Channel} from "../../api/types/channel";
import {Mailer} from "../../helper/mailer";
import {Init, Server} from "../../init";
import {UserHas} from "../../statements/userHas";
import {GetAgentOf} from "../../queries/getAgentOf";
import {AgentCanSee} from "../../statements/agentCanSee";
import {AgentCreate} from "../../data/mutations/agentCreate";
import {Agent, Entry, Group, prisma} from "../../generated";

class Implementation extends DirectService {
    constructor(server: Server, agent: Agent) {
        super(server, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return this.server.inviteContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const email_or_profile_name = newEntry.content.Invite.email_or_profile_name;
        const to_room = newEntry.content.Invite.to == "Room";
        const to_channel = newEntry.content.Invite.to == "Channel";
        const to_id = newEntry.content.Invite.to_id;
        const show_history = newEntry.content.Invite.show_history;

        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const bearerToken = (<any>newEntry).__bearerToken;

        const userHasAuthenticatedSession = await UserHas.authenticatedSession(sessionToken, csrfToken, bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, sessionToken);
        const agent = await prisma.agent({id: agentId});

        // Check if there is a profile with the given name
        // TODO: There can be multiple profiles with the same name
        const matchingProfiles = await prisma.agents({where: {name: email_or_profile_name, type: "Profile"}});
        let profile: Agent = null;
        if (matchingProfiles.length > 0) {
            profile = matchingProfiles[0];
        }

        if (!profile) {
            // Maybe an email address?
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_or_profile_name)) {
                const validationErrors = [];
                const summary = `Couldn't find a profile with the name '${email_or_profile_name}' nor is this value a valid email address.`;
                this.postError(summary, validationErrors, answerChannel.id);
                return;
            }

            // Send email
            Mailer.sendMail(email_or_profile_name,
                `${agent} invited you to ABIS.`,
                `Hello! Follow this link to join ${agent} in ABIS.`,
                `Hello! Follow this link to join ${agent} in ABIS.`);

            // TODO: Add a permanent storage for the invite and implement the actual logic
            await this.postContinueTo("", answerChannel.id);
            return;
        }

        if (to_room) {
            const room = await prisma.group({id: to_id});
            if (!room || !(await AgentCanSee.room(agentId, to_id))) {
                const validationErrors = [];
                const summary = `Couldn't find a room with the id ${to_id}.`;
                this.postError(summary, validationErrors, answerChannel.id);
                return;
            }

            await AgentCreate.membership(agentId, to_id, profile.id, show_history);
        } else if (to_channel) {
            await AgentCreate.channel(Init, agentId, profile.id, false, profile.name, profile.profileAvatar, sessionToken, csrfToken, bearerToken);
            // TODO: Handle the 'onNewChannel' event in the profile service
        } else {
            throw new Error(`Undefined state.`);
        }

        await this.postContinueTo("", answerChannel.id);
        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
    }
}

export const Index = {
    name: "InviteService",
    status: "Running",
    type: "Service",
    serviceDescription: "Invites users to a group or to ABIS.",
    profileAvatar: "nologo.png",
    implementation: Implementation,
};