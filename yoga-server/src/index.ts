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
      return new ProfileQueries().getSessionProfile(ctx.token);
    },
    async getProfile(root, {profileId}, ctx) {
      return new ProfileQueries().getProfile(ctx.token, profileId);
    },
    async myWorkspaces(root, {}, ctx) {
      return new GroupQueries().myWorkspaces(ctx.token);
    },
    async myMemberships(root, {token}, ctx) {
      return new GroupQueries().myMemberships(ctx.token);
    },
    async listProfiles(root, {token}, ctx) {
      return new ProfileQueries().listProfiles(ctx.token);
    },
    async listWorkspaces(root, {profileId}, ctx) {
      return new GroupQueries().listWorkspaces(ctx.token, profileId);
    },
    async listMemberships(root, {profileId}, ctx) {
      return new GroupQueries().listMemberships(ctx.token, profileId);
    },
    async listMembers(root, {groupId}, ctx) {
      return new GroupQueries().listMembers(ctx.token, groupId);
    },
    async listMessages(root, {groupId, profileId}, ctx) {
      return new GroupQueries().listMessages(ctx.token, groupId, profileId);
    },
    async getWorkspace(root, {workspaceId}, ctx) {
      return new GroupQueries().getWorkspace(ctx.token, workspaceId);
    }
  },
  Mutation: {
    async signup(root, {name, email, password}, ctx) {
      return new UserMutations().createUser(name, email, password);
    },
    async verifyEmail(root, {code}, ctx) {
      return new UserMutations().verifyEmail(code);
    },
    async login(root, {email, password}, ctx) {
      return new UserMutations().login(email, password);
    },
    async logout(root, {}, ctx) {
      return new UserMutations().logout(ctx.token);
    },
    async setSessionProfile(root, {token, profileId}, ctx) {
      return new UserMutations().setSessionProfile(ctx.token, profileId);
    },
    async createProfile(root, {name, picture, timezone}, ctx) {
      return new ProfileMutations().createProfile(ctx.token, name, picture, timezone);
    },
    async updateProfile(_, {token, profileId, name, picture, timezone, status}, ctx) {
      return new ProfileMutations().updateProfile(ctx.token, profileId, name, picture, timezone, status);
    },
    async createWorkspace(root, {hostProfileId, name, title, description, logo, tags}, ctx) {
      return new GroupMutations().createWorkspace(ctx.token, hostProfileId, name, title, description, logo, tags);
    },
    async updateWorkspace(root, {token, workspaceId, name, title, description, logo, tags, isHidden, isPublic}, ctx) {
      return new GroupMutations().updateWorkspace(ctx.token, workspaceId, name, title, description, logo, tags, isHidden, isPublic);
    },
    async addMember(_, {groupId, memberProfileId}, ctx) {
      return new GroupMutations().addMember(ctx.token, groupId, memberProfileId);
    },
    async removeMember(_, {token, groupId, memberProfileId}, ctx) {
      return new GroupMutations().removeMember(ctx.token, groupId, memberProfileId);
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
