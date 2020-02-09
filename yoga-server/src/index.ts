import {GraphQLServer, PubSub} from 'graphql-yoga'
import {Entry, Group, prisma, UserType} from './generated'
import {UserApiMutations} from "./api/mutations/userApiMutations";
import {ContextParameters} from "graphql-yoga/dist/types";
import {config} from "./config";
import {UserQueries} from "./api/queries/user/userQueries";
import {AgentQueries} from "./api/queries/agent/agentQueries";
import {GroupQueries2} from "./api/queries/groups/groupQueries2";
import {ChannelApiMutations} from "./api/mutations/channelApiMutations";
import {RoomApiMutations} from "./api/mutations/roomApiMutations";
import {EntryApiMutations} from "./api/mutations/entryApiMutations";
import {Service} from "./services/Service";
import {SignupService} from "./services/SignupService";
import {Helper} from "./helper/Helper";
import {ActionResponse} from "./api/mutations/actionResponse";

var cookie = require('cookie');

const serviceImplementations: { [name: string]: (serviceId: string) => Service } = {
    "SignupService": (serviceId) => new SignupService(serviceId)
};

export type NewEntryHook = (groupId: string, newEntry: Entry) => void;


const pubsub = new PubSub();
Service.pubsub = pubsub;

let newEntryServiceHooks: { [groupId: string]: [NewEntryHook] } = {};
let serviceInstances: { [serviceId: string]: Service } = {};

/*
Ensure that there are always two system users:
* Abis: Owns all system service agents
* Anonymous: Owns all anonymous sessions and agents
*/

async function executeCreateChannelServiceHooks(channel: Group | ActionResponse) {
    let serviceIDs = Object.keys(serviceInstances);
    let memberGroups = await prisma.groups({where: {memberships_some: {member: {id_in: serviceIDs}}}});

    memberGroups.forEach(group => {
        serviceIDs.forEach(serviceId => {
            let serviceInstance = serviceInstances[serviceId];
            serviceInstance.newChannel((<any>channel).id);
        });
    });
}

const resolvers = {
    // Resolvers for interface types
    Location: {
        __resolveType: (collection) => {
            return collection.type;
        }
    },
    Agent: {
        __resolveType: (collection) => {
            return collection.type;
        }
    },
    Group: {
        __resolveType: (collection) => {
            return collection.type;
        }
    },
    // Query resolvers
    Query: {
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
    },
    // Mutation resolvers
    Mutation: {
        async createSession(root, {clientTime}, ctx) {
            return UserApiMutations.createSession(clientTime, ctx.sessionToken, ctx.request);
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
            const channel = await ChannelApiMutations.createChannel(csrfToken, ctx.sessionToken, ctx.bearerToken, toAgentId);

            // Check if the memberships of any running service changed
            await executeCreateChannelServiceHooks(channel);

            return channel;
        },
        async deleteChannel(root, {csrfToken, toAgentId}, ctx) {
            return await ChannelApiMutations.deleteChannel(csrfToken, ctx.sessionToken, ctx.bearerToken, toAgentId);
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
                , ctx.sessionToken
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
            return await RoomApiMutations.deleteRoom(csrfToken, ctx.sessionToken, ctx.bearerToken, roomId)
        },

        async createEntry(root, {csrfToken, createEntryInput}, ctx) {
            let entry = await EntryApiMutations.createEntry(
                csrfToken
                , ctx.sessionToken
                , ctx.bearerToken
                , createEntryInput.roomId
                , createEntryInput.type
                , createEntryInput.name
                , createEntryInput.content
                , createEntryInput.contentEncoding);

            let hooks = newEntryServiceHooks[createEntryInput.roomId];
            if (hooks) {
                hooks.forEach(o => o(createEntryInput.roomId, <any>entry));
            }

            pubsub.publish("createEntry", {
                id: (<any>entry).id,
                name: (<any>entry).name,
            });

            return entry;
        },
        async updateEntry(root, {csrfToken}, ctx) {
            throw new Error("Not implemented");
        },
        async deleteEntry(root, {csrfToken, entryId}, ctx) {
            return EntryApiMutations.deleteEntry(csrfToken, ctx.sessionToken, ctx.bearerToken, entryId);
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
    Subscription: {
        newEntry: {
            subscribe: (parent, args, {pubsub}) => {
                return pubsub.asyncIterator('newEntry');
            },
        }
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
            bearerToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).bearerToken : null,
            sessionToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).sessionToken : null,
            pubsub
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
}, async () => {
    console.log('Server is running on ' + config.env.domain + ":4000");

    console.log('Ensuring system users ...');

    let systemUser = await prisma.user({email: config.env.systemUser});
    if (!systemUser) {
        systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
        console.log('Created ' + config.env.systemUser);

        let signupAgent = [await prisma.createAgent({
            owner: systemUser.id,
            createdBy: systemUser.id,
            name: "SignupService",
            status: "Running",
            type: "Service",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        })];
        await prisma.updateUser({
            where: {
                id: systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupAgent[0].id
                    }
                }
            }
        });
        console.log('Created ' + config.env.signupAgentName);
    }
    let anonymousUser = await prisma.user({email: config.env.anonymousUser});
    if (!anonymousUser) {
        anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
        console.log('Created ' + config.env.anonymousUser);
    }
    console.log('System users O.K.');

    console.log('Initializing services ...');

    let services = await prisma.agents({where: {type: "Service"}});
    await Promise.all(services.map(async svc => {
        let serviceImplementation = serviceImplementations[svc.name];
        if (!serviceImplementation) {
            return;
        }

        console.log(`* ${svc.name}: Creating instance`);
        let serviceImplInstance = serviceImplementation(svc.id);
        serviceInstances[svc.id] = serviceImplInstance;
    }));

    if ((await  prisma.contentEncodings({where:{name:"Signup"}})).length == 0) {
        console.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
        await prisma.createContentEncoding({
            charset: "utf-8",
            createdBy: systemUser.id,
            maintainer: systemUser.id,
            name: "Signup",
            type: "JsonSchema",
            data: JSON.stringify({
                "Signup": {
                    "type": "object",
                    "properties": {
                        "first_name": {"type": "string"},
                        "last_name": {"type": "string"},
                        "email": {"type": "string"},
                        "password": {"type": "string"},
                        "passwordConfirmation": {"type": "string"}
                    },
                    "required": ["first_name", "last_name", "email", "password", "passwordConfirmation"]
                }
            })
        });
    }

    console.log('Services O.K.');
});
