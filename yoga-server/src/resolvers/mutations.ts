import {UserCreate} from "../data/mutations/userCreate";
import {UserHas} from "../statements/userHas";
import {GetAgentOf} from "../queries/getAgentOf";
import {AgentCreate} from "../data/mutations/agentCreate";
import {Helper} from "../helper/Helper";
import {ActionResponse} from "../api/mutations/actionResponse";
import {AgentCanPostTo} from "../statements/agentCanPostTo";
import {Entry, prisma} from "../generated";
import {AgentPostTo} from "../data/mutations/agentPostTo";
import {ServerInit} from "../serverInit";

export const mutations = {
    async createSession(root, {clientTime}, ctx) {
        // Every new api user must create a session.
        // The session will be created in the context of the "anonymous" system user together with a temporary profile first.
        // When the user authenticated with the Signup- or LoginService, a new session will be created
        // and sent to the user via his channel to the service.
        const anonymousUserId = ServerInit.anonymousUser.id;
        const anonymousProfile = await UserCreate.profile(
            anonymousUserId,
            `anon_${new Date().getTime()}`,
            "anon.png",
            "Available");

        const session = await UserCreate.session(anonymousUserId, anonymousProfile.id, null, clientTime);

        Helper.setSessionTokenCookie(session.sessionToken, ctx.request);

        return <ActionResponse> {
            success: true,
            code: session.csrfToken,
            message: "Store the value from the 'code' field in the localStorage and send it with every following request."
        };
    },

    async createChannel(root, {csrfToken, toAgentId}, ctx) {
        // Every user with a session (and thus a profile) can create a channel to another agent.
        const userHasSession = await UserHas.anonymousSession(ctx.sessionToken, csrfToken);
        if (!userHasSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(ctx.sessionToken, csrfToken);
        const newChannel = await AgentCreate.channel(agentId, toAgentId, "New Channel", "channel.png");

        (<any>newChannel).receiver = await prisma.agent({id:toAgentId});

        return newChannel;
    },

    async createEntry(root, {csrfToken, createEntryInput}, ctx) {
        const userHasAuthenticatedSession = await UserHas.authenticatedSession(ctx.sessionToken, csrfToken, ctx.bearerToken);
        if (!userHasAuthenticatedSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(ctx.sessionToken, csrfToken);
        const groupId = createEntryInput.roomId;

        const group = await prisma.group({id:groupId});
        if (!group) {
            throw new Error(`The specified group doesn't exist: ${createEntryInput.roomId}`)
        }

        let canPostTo = false;
        switch (group.type) {
            case "Channel": canPostTo = await AgentCanPostTo.channel(agentId, groupId); break;
            case "Room": canPostTo = await AgentCanPostTo.room(agentId, groupId); break;
            case "Stash": canPostTo = await AgentCanPostTo.stash(agentId, groupId); break;
        }
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

        let entry: Entry = null;
        switch (group.type) {
            case "Channel": entry = await AgentPostTo.channel(agentId, groupId, newEntryInput); break;
            case "Room": entry = await AgentPostTo.room(agentId, groupId, newEntryInput); break;
            case "Stash": entry = await AgentPostTo.stash(agentId, groupId, newEntryInput); break;
        }

        return entry;
    },

    async deleteChannel(root, {csrfToken, toAgentId}, ctx) {
        throw new Error("Not implemented");
    },

    async createRoom(root, {csrfToken, createRoomInput}, ctx) {
        throw new Error("Not implemented");
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