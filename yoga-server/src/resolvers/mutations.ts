import {UserCreate} from "../data/mutations/userCreate";
import {UserHas} from "../statements/userHas";
import {GetAgentOf} from "../queries/getAgentOf";
import {AgentCreate} from "../data/mutations/agentCreate";
import {Helper} from "../helper/helper";
import {ActionResponse} from "../api/mutations/actionResponse";
import {prisma} from "../generated";
import {Init} from "../init";
import {AgentCanCreate} from "../statements/agentCanCreate";
import {EventBroker} from "../services/eventBroker";

export const mutations = {
    async createSession(root, {clientTime}, ctx) {
        // Every new api user must create a session.
        // The new session, together with a temporary profile, will be created in the context of the "anonymous" system-user.
        // When the user authenticated with the Signup- or LoginService, a new session will be created
        // and sent to the user via his channel to the service.
        const anonymousUserId = Init.anonymousUser.id;
        const anonymousProfile = await UserCreate.profile(
            anonymousUserId,
            `anon_${new Date().getTime()}`,
            "anon.png",
            "Available");

        const session = await UserCreate.session(anonymousUserId, anonymousProfile.id, null, clientTime);

        Helper.setSessionTokenCookie(session.sessionToken, ctx.request);
        Helper.clearBearerTokenCookie(ctx.request);

        return <ActionResponse> {
            success: true,
            code: session.csrfToken,
            data: anonymousProfile.id,
            message: "Store the value from the 'code' field in the localStorage and send it with every following request."
        };
    },

    async verifySession(root, {csrfToken}, ctx) {
        const sessions = await prisma.sessions({
            where:{
                csrfToken:csrfToken,
                sessionToken:ctx.sessionToken
            }
        });
        if (sessions.length != 1) {
            return <ActionResponse>{
                success: false
            };
        }
        const session = sessions[0];

        const isValid = session.id
            && session.timedOut == null
            && session.loggedOut == null
            && Date.parse(session.validTo) > Date.now();

        return <ActionResponse>{
           success: isValid
        };
    },

    async createChannel(root, {csrfToken, toAgentId}, ctx) {
        // Every user with a session (and thus a profile) can create a channel to another agent.
        const userHasSession = await UserHas.anonymousSession(ctx.sessionToken, csrfToken);
        if (!userHasSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);
        const newChannel = await AgentCreate.channel(Init, agentId, toAgentId, "New Channel", "channel.png");

        (<any>newChannel).receiver = await prisma.agent({id:toAgentId});

        return newChannel;
    },

    async createEntry(root, {csrfToken, createEntryInput}, ctx) {
        const userHasAuthenticatedSession = await UserHas.authenticatedSession(ctx.sessionToken, csrfToken, ctx.bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);
        const groupId = createEntryInput.roomId;

        const group = await prisma.group({id:groupId});
        if (!group) {
            throw new Error(`The specified group doesn't exist: ${createEntryInput.roomId}`)
        }

        let canPostTo = await AgentCanCreate.entry(agentId, groupId);
        if (!canPostTo) {
            throw new Error(`Agent '${agentId}' cannot post to group ${groupId}`);
        }

        const newEntryInput = {
            owner: agentId,
            createdBy: agentId,
            name: createEntryInput.name,
            type: createEntryInput.type,
            contentEncoding: createEntryInput.contentEncoding,
            content: createEntryInput.content
        };

        const entry = await AgentCreate.entry(Init, agentId, groupId, newEntryInput, ctx.request);
        return entry;
    },

    async deleteChannel(root, {csrfToken, toAgentId}, ctx) {
        throw new Error("Not implemented");
    },

    async createRoom(root, {csrfToken, createRoomInput}, ctx) {
        const userHasAuthenticatedSession = await UserHas.authenticatedSession(ctx.sessionToken, csrfToken, ctx.bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);

        // TODO: Implement AgentCanCreate.room()
        /*if (!(await AgentCanCreate.room(agentId, createRoomInput.name))) {
            throw new Error(`Agent ${agentId} cannot create a room with the name ${createRoomInput.name}`);
        }*/

        const room = await AgentCreate.room(Init, agentId, createRoomInput.name, createRoomInput.logo, true);
        (<any>room).isPrivate = !room.isPublic;
        (<any>room).inbox = {id:""};
        (<any>room).memberships = [];
        return room;
    },
    async updateRoom(root, {csrfToken, updateRoomInput}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteRoom(root, {csrfToken, roomId}, ctx) {
        throw new Error("Not implemented");
    },

    async createProfile(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteProfile(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async updateProfile(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },

    async createStash(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async updateStash(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteStash(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },

    async updateEntry(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteEntry(root, {csrfToken, entryId}, ctx) {
        throw new Error("Not implemented");
    },

    async addTag(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async removeTag(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },

    async createLocation(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async updateLocation(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteLocation(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
};