import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated'
import {UserMutations} from "./mutations/users/userMutations";
import {ProfileMutations} from "./mutations/profiles/profileMutations";
import {GroupMutations} from "./mutations/groups/groupMutations";
import {ContextParameters} from "graphql-yoga/dist/types";
import {GroupQueries} from "./queries/groups/groupQueries";
import {ProfileQueries} from "./queries/profiles/profileQueries";

const resolvers = {
  Query: {
    async getSessionProfile(root, {token}, ctx) {
      return ProfileQueries.getSessionProfile(ctx.token);
    },
    async listProfiles(root, {token}, ctx) {
      return ProfileQueries.listProfiles(ctx.token);
    },
    async getProfile(root, {profileId}, ctx) {
      return ProfileQueries.getProfile(ctx.token, profileId);
    },
    async myWorkspaces(root, {token}, ctx) {
      return GroupQueries.myWorkspaces(ctx.token);
    },
    async myMemberships(root, {token}, ctx) {
      return GroupQueries.myMemberships(ctx.token);
    },
    async listWorkspaces(root, {profileId}, ctx) {
      return GroupQueries.listWorkspaces(ctx.token, profileId);
    },
    async listMemberships(root, {profileId}, ctx) {
      return GroupQueries.listMemberships(ctx.token, profileId);
    },
    async listMembers(root, {groupId}, ctx) {
      return GroupQueries.listMembers(ctx.token, groupId);
    },
    async listMessages(root, {groupId, profileId}, ctx) {
      return GroupQueries.listMessages(ctx.token, groupId, profileId);
    },
    async getWorkspace(root, {workspaceId}, ctx) {
      return GroupQueries.getWorkspace(ctx.token, workspaceId);
    }
  },
  Mutation: {
    async signup(root, {name, email, password}, ctx) {
      return UserMutations.createUser(name, email, password);
    },
    async verifyEmail(root, {code}, ctx) {
      return UserMutations.verifyEmail(code);
    },
    async login(root, {email, password}, ctx) {
      return UserMutations.login(email, password);
    },
    async logout(root, {}, ctx) {
      return UserMutations.logout(ctx.token);
    },
    async setSessionProfile(root, {token, profileId}, ctx) {
      return UserMutations.setSessionProfile(ctx.token, profileId);
    },
    async createProfile(root, {name, picture, timezone}, ctx) {
      return ProfileMutations.createProfile(ctx.token, name, picture, timezone);
    },
    async updateProfile(_, {token, profileId, name, picture, timezone, status}, ctx) {
      return ProfileMutations.updateProfile(ctx.token, profileId, name, picture, timezone, status);
    },
    async createWorkspace(root, {hostProfileId, name, title, description, logo, tags}, ctx) {
      return GroupMutations.createWorkspace(ctx.token, hostProfileId, name, title, description, logo, tags);
    },
    async updateWorkspace(root, {token, workspaceId, name, title, description, logo, tags, isHidden, isPublic}, ctx) {
      return GroupMutations.updateWorkspace(ctx.token, workspaceId, name, title, description, logo, tags, isHidden, isPublic);
    },
    async addMember(_, {groupId, memberProfileId}, ctx) {
      return GroupMutations.addMember(ctx.token, groupId, memberProfileId);
    },
    async removeMember(_, {token, groupId, memberProfileId}, ctx) {
      return GroupMutations.removeMember(ctx.token, groupId, memberProfileId);
    }
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req: ContextParameters) => {
    return {
      prisma,
      token: req.request.get("Token"),
      request: req.request,
      response: req.response,
      connection: req.connection
    };
  }
});

server.start({
  cors: {
    methods: "POST",
    origin: "*",
    allowedHeaders: "*",
    optionsSuccessStatus: 200
  },
},() => console.log('Server is running on http://localhost:4000'));
