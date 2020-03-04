import {prisma} from "../generated/prisma_client";
import {AgentQueries} from "../api/queries/agent/agentQueries";
import {UserQueries} from "../api/queries/user/userQueries";
import {GroupQueries2} from "../api/queries/groups/groupQueries2";

export const queries = {
    async contentEncodings(root, {csrfToken}, ctx) {
        return prisma.contentEncodings();
    },
    async getSystemServices(root, {csrfToken}, ctx) {
        return AgentQueries.getSystemServices(csrfToken, ctx.sessionToken);
    },
    async myAccount(root, {csrfToken}, ctx) {
        return UserQueries.myAccount(csrfToken, ctx.bearerToken);
    },
    async myProfiles(root, {csrfToken}, ctx) {
        return UserQueries.myProfiles(csrfToken, ctx.bearerToken);
    },
    async myServices(root, {csrfToken}, ctx) {
        return UserQueries.myServices(csrfToken, ctx.bearerToken);
    },
    async myStashes(root, {csrfToken}, ctx) {
        return AgentQueries.myStashes(csrfToken, ctx.sessionToken, ctx.bearerToken);
    },
    async myChannels(root, {csrfToken}, ctx) {
        return AgentQueries.myChannels(csrfToken, ctx.sessionToken, ctx.bearerToken);
    },
    async myRooms(root, {csrfToken}, ctx) {
        return AgentQueries.myRooms(csrfToken, ctx.sessionToken, ctx.bearerToken);
    },
    async myMemberships(root, {csrfToken, groupType, isPublic}, ctx) {
        return AgentQueries.myMemberships(csrfToken, ctx.sessionToken, ctx.bearerToken, groupType, isPublic);
    },
    async findRooms(root, {csrfToken, searchText}, ctx) {
        return GroupQueries2.findRooms(csrfToken, ctx.sessionToken, ctx.bearerToken, searchText);
    },
    async findMemberships(root, {csrfToken, roomId, searchText}, ctx) {
        return GroupQueries2.findMemberships(csrfToken, ctx.sessionToken, ctx.bearerToken, roomId, searchText);
    },
    async getEntries(root, {csrfToken, groupId, from, to}, ctx) {
        return GroupQueries2.getEntries(csrfToken, ctx.sessionToken, ctx.bearerToken, groupId, from, to);
    }
};