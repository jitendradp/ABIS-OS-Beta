import {GraphQLServer} from 'graphql-yoga'
import {prisma, UserType} from './generated'
import {UserApiMutations} from "./api/mutations/userApiMutations";
import {ContextParameters} from "graphql-yoga/dist/types";
import {config} from "./config";
import {UserQueries} from "./api/queries/user/userQueries";
import {AgentQueries} from "./api/queries/agent/agentQueries";
import {GroupQueries2} from "./api/queries/groups/groupQueries2";
import {ChannelApiMutations} from "./api/mutations/channelApiMutations";
import {RoomApiMutations} from "./api/mutations/roomApiMutations";
import {EntryApiMutations} from "./api/mutations/entryApiMutations";

var cookie = require('cookie');

const resolvers = {
    // Resolvers for interface types
    Location: {
        __resolveType: (collection) => {
            return false;
        }
    },
    Agent: {
        __resolveType: (collection) => {
            return false;
        }
    },
    Group: {
        __resolveType: (collection) => {
            return false;
        }
    },
    // Query resolvers
    Query: {
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
            return AgentQueries.myStashes(csrfToken, ctx.bearerToken);
        },
        async myChannels(root, {csrfToken}, ctx) {
            return AgentQueries.myChannels(csrfToken, ctx.bearerToken);
        },
        async myRooms(root, {csrfToken}, ctx) {
            return AgentQueries.myRooms(csrfToken, ctx.bearerToken);
        },
        async myMemberships(root, {csrfToken, groupType, isPublic}, ctx) {
            return AgentQueries.myMemberships(csrfToken, ctx.bearerToken, groupType, isPublic);
        },
        async findRooms(root, {csrfToken, searchText}, ctx) {
            return GroupQueries2.findRooms(csrfToken, ctx.bearerToken, searchText);
        },
        async findMemberships(root, {csrfToken, roomId, searchText}, ctx) {
            return GroupQueries2.findMemberships(csrfToken, ctx.bearerToken, roomId, searchText);
        },
        async getEntries(root, {csrfToken, groupId, from, to}, ctx) {
            return GroupQueries2.getEntries(csrfToken, ctx.bearerToken, groupId, from, to);
        }
    },
    // Mutation resolvers
    Mutation: {
        async signup(root, {signupInput}) {
            if (signupInput.type == <UserType>"Person") {
                return UserApiMutations.createPerson(
                    signupInput.type,
                    signupInput.email,
                    signupInput.password,
                    signupInput.personFirstName,
                    signupInput.personLastName,
                    signupInput.timezone,
                    signupInput.personPhone,
                    signupInput.personMobilePhone);
            } else if (signupInput.type == <UserType>"Organization") {
                return UserApiMutations.createOrganization(
                    signupInput.type,
                    signupInput.email,
                    signupInput.password,
                    signupInput.timezone,
                    signupInput.organizationName);
            } else {
                throw new Error("Invalid signup UserType: '" + signupInput.type + "'")
            }
        },
        async verifyEmail(root, {code}, ctx) {
            return UserApiMutations.verifyEmail(code, ctx.request);
        },
        async login(root, {email, password}, ctx) {
            return UserApiMutations.login(email, password, ctx.request);
        },
        async logout(root, {csrfToken}, ctx) {
            return UserApiMutations.logout(csrfToken, ctx.bearerToken, ctx.request);
        },
        async verifySession(root, {csrfToken}, ctx) {
            return UserApiMutations.verifySession(csrfToken, ctx.bearerToken, ctx.request);
        },

        // Users can't create or delete profiles for now
        async createProfile(root, {csrfToken}, ctx) {
            throw new Error("Not implemented");
        },
        async deleteProfile(root, {csrfToken}, ctx) {
            throw new Error("Not implemented");
        },
        async updateProfile(root, {csrfToken}, ctx) {

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

        async createChannel(root, {csrfToken, toAgentId}, ctx) {
            return await ChannelApiMutations.createChannel(csrfToken, ctx.bearerToken, toAgentId);
        },
        async deleteChannel(root, {csrfToken, toAgentId}, ctx) {
            return await ChannelApiMutations.deleteChannel(csrfToken, ctx.bearerToken, toAgentId);
        },

        async createRoom(root, {csrfToken, createRoomInput}, ctx) {
            return await RoomApiMutations.createRoom(
                  csrfToken
                , ctx.bearerToken
                , createRoomInput.isPublic
                , createRoomInput.name
                , createRoomInput.title
                , createRoomInput.description
                , createRoomInput.logo
                , createRoomInput.banner);
        },
        async updateRoom(root, {csrfToken, updateRoomInput}, ctx) {
            return await RoomApiMutations.updateRoom(
                csrfToken
                , ctx.bearerToken
                , updateRoomInput.id
                , updateRoomInput.isPublic
                , updateRoomInput.name
                , updateRoomInput.title
                , updateRoomInput.description
                , updateRoomInput.logo
                , updateRoomInput.banner);
        },
        async deleteRoom(root, {csrfToken, roomId}, ctx) {
            return await RoomApiMutations.deleteRoom(csrfToken, ctx.bearerToken, roomId)
        },

        async createEntry(root, {csrfToken, createEntryInput}, ctx) {
            return EntryApiMutations.createEntry(
                csrfToken
                , ctx.bearerToken
                , createEntryInput.roomId
                , createEntryInput.type
                , createEntryInput.name
                , createEntryInput.content
                , createEntryInput.contentEncoding)
        },
        async updateEntry(root, {csrfToken}, ctx) {
            throw new Error("Not implemented");
        },
        async deleteEntry(root, {csrfToken, entryId}, ctx) {
            return EntryApiMutations.deleteEntry(csrfToken, ctx.bearerToken, entryId);
        },

        async addTag(root, {csrfToken}, ctx) {
        },
        async removeTag(root, {csrfToken}, ctx) {
        },

        async createLocation(root, {csrfToken}, ctx) {
        },
        async updateLocation(root, {csrfToken}, ctx) {
        },
        async deleteLocation(root, {csrfToken}, ctx) {
        },
    },
};

const server = new GraphQLServer({
    typeDefs: './src/api/schema.graphql',
    resolvers,
    context: (req: ContextParameters) => {
        return {
            prisma,
            request: req.request,
            response: req.response,
            connection: req.connection,
            bearerToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).bearerToken : null
        };
    }
});

var morgan = require('morgan');
server.use(morgan('combined'));

server.start({
    cors: {
        methods: ["OPTIONS", "POST"],
        origin: "http://" + config.env.domain + ":4200",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
        optionsSuccessStatus: 200,
        credentials: true
    }
}, () => console.log('Server is running on ' + config.env.domain + ":4000"));
