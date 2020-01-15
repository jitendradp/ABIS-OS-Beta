import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated'
import {UserMutations} from "./mutations/user/userMutations";
import {ProfileMutations} from "./mutations/profiles/profileMutations";
import {GroupMutations} from "./mutations/groups/groupMutations";
import {ContextParameters} from "graphql-yoga/dist/types";
import {GroupQueries} from "./queries/groups/groupQueries";
import {ProfileQueries} from "./queries/profiles/profileQueries";
import {config} from "./config";
import {UserQueries} from "./queries/user/userQueries";
var cookie = require('cookie');

const resolvers = {
  Query: {
    async myWorkspaces(root, {csrfToken}, ctx) {
      return GroupQueries.myWorkspaces(csrfToken, ctx.authToken);
    },
    async myMemberships(root, {csrfToken}, ctx) {
      return GroupQueries.myMemberships(csrfToken, ctx.authToken);
    },
    async getSessionProfile(root, {csrfToken}, ctx) {
      return ProfileQueries.getSessionProfile(csrfToken, ctx.authToken);
    },
    async listProfiles(root, {csrfToken}, ctx) {
      return ProfileQueries.listProfiles(csrfToken, ctx.authToken);
    },
    async listWorkspaces(root, {csrfToken, profileId}, ctx) {
      return GroupQueries.listWorkspaces(csrfToken, ctx.authToken, profileId);
    },
    async listMemberships(root, {csrfToken, profileId}, ctx) {
      return GroupQueries.listMemberships(csrfToken, ctx.authToken, profileId);
    },
    async listMembers(root, {csrfToken, groupId}, ctx) {
      return GroupQueries.listMembers(csrfToken, ctx.authToken, groupId);
    },
    async listMessages(root, {csrfToken, groupId, profileId, begin, end}, ctx) {
      return GroupQueries.listMessages(csrfToken, ctx.authToken, groupId, profileId, begin, end);
    },
    async getProfile(root, {csrfToken, profileId}, ctx) {
      return ProfileQueries.getProfile(csrfToken, ctx.authToken, profileId);
    },
    async getWorkspace(root, {csrfToken, workspaceId}, ctx) {
      return GroupQueries.getWorkspace(csrfToken, ctx.authToken, workspaceId);
    },
    async getUserInformation(root, {csrfToken}, ctx) {
      return UserQueries.getUserInformation(csrfToken, ctx.authToken);
    }
  },
  Mutation: {
    async signup(root, {name, email, password}, ctx) {
      return UserMutations.createUser(name, email, password);
    },
    async verifyEmail(root, {code}, ctx) {
      return UserMutations.verifyEmail(code, ctx.request);
    },
    async verifySession(root, {csrfToken}, ctx) {
      return UserMutations.verifySession(csrfToken, ctx.authToken, ctx.request);
    },
    async login(root, {email, password}, ctx) {
      return UserMutations.login(email, password, ctx.request);
    },
    async logout(root, {csrfToken}, ctx) {
      return UserMutations.logout(csrfToken, ctx.authToken, ctx.request);
    },
    async setSessionProfile(root, {csrfToken, profileId}, ctx) {
      return UserMutations.setSessionProfile(csrfToken, ctx.authToken, profileId);
    },
    async createProfile(root, {csrfToken, name, picture, timezone}, ctx) {
      return ProfileMutations.createProfile(csrfToken, ctx.authToken, name, picture, timezone);
    },
    async updateProfile(_, {csrfToken, profileId, name, picture, timezone, status}, ctx) {
      return ProfileMutations.updateProfile(csrfToken, ctx.authToken, profileId, name, picture, timezone, status);
    },
    async createWorkspace(root, {csrfToken, hostProfileId, name, title, description, logo, tags}, ctx) {
      return GroupMutations.createWorkspace(csrfToken, ctx.authToken, hostProfileId, name, title, description, logo, tags);
    },
    async updateWorkspace(root, {csrfToken, workspaceId, name, title, description, logo, tags, isHidden, isPublic}, ctx) {
      return GroupMutations.updateWorkspace(csrfToken, ctx.authToken, workspaceId, name, title, description, logo, tags, isHidden, isPublic);
    },
    async addMember(_, {csrfToken, groupId, memberProfileId}, ctx) {
      return GroupMutations.addMember(csrfToken, ctx.authToken, groupId, memberProfileId);
    },
    async removeMember(_, {csrfToken, groupId, memberProfileId}, ctx) {
      return GroupMutations.removeMember(csrfToken, ctx.authToken, groupId, memberProfileId);
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
      connection: req.connection,
      authToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).authToken : null
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
