import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated'
import {UserMutations} from "./mutations/users/userMutations";
import {ProfileMutations} from "./mutations/profiles/profileMutations";
import {GroupMutations} from "./mutations/groups/groupMutations";
import {ContextParameters} from "graphql-yoga/dist/types";
import {GroupQueries} from "./queries/groups/groupQueries";
import {ProfileQueries} from "./queries/profiles/profileQueries";
import {config} from "./config";

const resolvers = {
  Query: {
    async myWorkspaces(root, {token}, ctx) {
      return GroupQueries.myWorkspaces(token);
    },
    async myMemberships(root, {token}, ctx) {
      return GroupQueries.myMemberships(token);
    },
    async getSessionProfile(root, {token}, ctx) {
      return ProfileQueries.getSessionProfile(token);
    },
    async listProfiles(root, {token}, ctx) {
      return ProfileQueries.listProfiles(token);
    },
    async listWorkspaces(root, {token, profileId}, ctx) {
      return GroupQueries.listWorkspaces(token, profileId);
    },
    async listMemberships(root, {token, profileId}, ctx) {
      return GroupQueries.listMemberships(token, profileId);
    },
    async listMembers(root, {token, groupId}, ctx) {
      return GroupQueries.listMembers(token, groupId);
    },
    async listMessages(root, {token, groupId, profileId, begin, end}, ctx) {
      return GroupQueries.listMessages(token, groupId, profileId, begin, end);
    },
    async getProfile(root, {token, profileId}, ctx) {
      return ProfileQueries.getProfile(token, profileId);
    },
    async getWorkspace(root, {token, workspaceId}, ctx) {
      return GroupQueries.getWorkspace(token, workspaceId);
    }
  },
  Mutation: {
    async signup(root, {name, email, password}, ctx) {
      return UserMutations.createUser(name, email, password);
    },
    async verifyEmail(root, {code}, ctx) {
      return UserMutations.verifyEmail(code);
    },
    async verifySession(root, {token}, ctx) {
      return UserMutations.verifySession(token, ctx.request);
    },
    async login(root, {email, password}, ctx) {
      return UserMutations.login(email, password, ctx.request);
    },
    async logout(root, {token}, ctx) {
      return UserMutations.logout(token);
    },
    async setSessionProfile(root, {token, profileId}, ctx) {
      return UserMutations.setSessionProfile(token, profileId);
    },
    async createProfile(root, {token, name, picture, timezone}, ctx) {
      return ProfileMutations.createProfile(token, name, picture, timezone);
    },
    async updateProfile(_, {token, profileId, name, picture, timezone, status}, ctx) {
      return ProfileMutations.updateProfile(token, profileId, name, picture, timezone, status);
    },
    async createWorkspace(root, {token, hostProfileId, name, title, description, logo, tags}, ctx) {
      return GroupMutations.createWorkspace(token, hostProfileId, name, title, description, logo, tags);
    },
    async updateWorkspace(root, {token, workspaceId, name, title, description, logo, tags, isHidden, isPublic}, ctx) {
      return GroupMutations.updateWorkspace(token, workspaceId, name, title, description, logo, tags, isHidden, isPublic);
    },
    async addMember(_, {token, groupId, memberProfileId}, ctx) {
      return GroupMutations.addMember(token, groupId, memberProfileId);
    },
    async removeMember(_, {token, groupId, memberProfileId}, ctx) {
      return GroupMutations.removeMember(token, groupId, memberProfileId);
    }
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req: ContextParameters) => {
    return {
      prisma,
      request: req.request,
      response: req.response,
      connection: req.connection
    };
  }
});

var morgan = require('morgan');
server.use(morgan('combined'));

server.start({
  cors: {
    methods: ["OPTIONS","POST"],
    origin:  "http://" + config.env.domain + ":4200",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    optionsSuccessStatus: 200,
    credentials: true
  }
},() => console.log('Server is running on http://localhost:4000'));
