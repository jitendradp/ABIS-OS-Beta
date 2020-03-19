import {Agent, ContentEncoding, Entry, Group, prisma, User} from "./generated";
import {config} from "./config";
import {EventBroker, Topic, Topics} from "./services/eventBroker";
import {Helper} from "./helper/helper";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {AgentHost} from "./services/agentHost";
import {Channel} from "./api/types/channel";
import {UserCreate} from "./data/mutations/userCreate";
import {AgentCreate} from "./data/mutations/agentCreate";
import {Service} from "./services/service";

export class Init {
    static get serviceHost(): AgentHost {
        return Init._serviceHost;
    }

    static get systemUser(): User {
        return Init._systemUser;
    }

    static get anonymousUser(): User {
        return Init._anonymousUser;
    }

    static get signupService(): string {
        return Init._serviceNameMap["SignupService"].id;
    }

    static get loginServiceId(): string {
        return Init._serviceNameMap["LoginService"].id;
    }

    static get verifyEmailServiceId(): string {
        return Init._serviceNameMap["VerifyEmailService"].id;
    }

    static get datenDieterSystemAgent(): Agent {
        return Init._datenDieterSystemAgent;
    }

    static get newChannelTopic(): Topic<Channel> {
        return Init._newChannelTopic;
    }

    static get newEntryTopic(): Topic<Entry> {
        return Init._newEntryTopic;
    }

    static get newRoomTopic(): Topic<Group> {
        return Init._newRoomTopic;
    }

    static get signupContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["Signup"];
    }

    static get verifyEmailContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["VerifyEmail"];
    }

    static get loginContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["Login"];
    }

    static get errorContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["Error"];
    }

    static get continuationContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["Continuation"];
    }

    static get geoJsonFeatureContentEncoding(): ContentEncoding {
        return Init.contentEncodingsNameMap["GeoJsonFeature"];
    }

    static get contentEncodings(): ContentEncoding[] {
        return Object.keys(Init._contentEncodingsIdMap).map(id => Init._contentEncodingsIdMap[id]);
    }
    static get contentEncodingsNameMap(): {[name:string]:ContentEncoding} {
        return Init._contentEncodingsNameMap;
    }
    static get contentEncodingsIdMap(): {[name:string]:ContentEncoding} {
        return Init._contentEncodingsIdMap;
    }

    private static _systemUser: User;
    private static _anonymousUser: User;
    private static _datenDieterSystemAgent: Agent;
    private static _newChannelTopic: Topic<Channel>;
    private static _newEntryTopic: Topic<Entry>;
    private static _newRoomTopic: Topic<Group>;
    private static _countriesSystemRoom: Group;

    private static _contentEncodingsNameMap: {[name:string]:ContentEncoding} = {};
    private static _contentEncodingsIdMap: {[id:string]:ContentEncoding} = {};

    private static _serviceNameMap: {[name:string]:Service} = {};
    private static _serviceIdMap: {[id:string]:Service} = {};

    private static _serviceHost = new AgentHost(EventBroker.instance);

    public static async run() {
        await Init.createSystemUser();
        await Init.createAnonymousUser();

        await Init.clearAnonymousProfilesAndSessions();

        await Init.createContentEncodings();

        await Init.createSystemAgents();

        await Init.createServices();
        await Init.createSystemTopics();

        await Init.loadAgents();

        await Init.createSystemGroups();
    }

    private static async createSystemAgents() {
        const existingDatenDieter = await prisma.agents({where:{owner:Init._systemUser.id, name: "Daten Dieter"}});
        if (existingDatenDieter.length == 0) {
            Init._datenDieterSystemAgent = await UserCreate.profile(Init._systemUser.id, "Daten Dieter", "avatar.png", "Available");
        } else {
            Init._datenDieterSystemAgent = existingDatenDieter[0];
        }
    }

    private static async createSystemGroups() {
        const existingCountriesSystemRoom = await prisma.groups({where:{owner:Init._datenDieterSystemAgent.id, type:"Room", name:"Countries"}});
        if (existingCountriesSystemRoom.length == 0) {
            Init._countriesSystemRoom = await AgentCreate.room(Init._datenDieterSystemAgent.id, "Countries", "logo.png", true);
            await Init.createCountryEntries();
        } else {
            Init._countriesSystemRoom = existingCountriesSystemRoom[0];
        }
    }

    private static async clearAnonymousProfilesAndSessions() {

        /*
        The anonymous profiles and all their artifacts should be deleted on every server restart
        as well as periodically.
        Anonymous agents ..
        * .. can have sessions
        * .. can be member in channels
        * .. can invite to own channels
        * .. can create entries in own channels
        * .. can create channels
         */

        // Clear sessions
        const anonSessions = await prisma.sessions({where: {user: {id: this.anonymousUser.id}}});
        await prisma.deleteManySessions({id_in: anonSessions.map(o => o.id)});

        // Find all anonymous agents and get their ids
        const anonAgents = await prisma.user({id: this.anonymousUser.id}).agents();
        const anonAgentIds = anonAgents.map(o => o.id);

        // Find all channels that have been created to anonymous agents
        const channelsToAnonProfiles = await prisma.groups({
            where: {
                type: "Channel",
                memberships_every: {member: {id_in: anonAgentIds}}
            }
        });

        // Delete all channels that have been created in the direction to an anon profile
        await prisma.deleteManyGroups({id_in: channelsToAnonProfiles.map(o => o.id)});

        // Delete all groups that have been created by anonymous agents
        await prisma.deleteManyGroups({owner_in: anonAgentIds});

        // Delete all anonymous agents
        await prisma.deleteManyAgents({id_in: anonAgentIds});
    }

    /**
     * Loads all agents from the database and creates an instance of their implementation in the service host
     */
    private static async loadAgents() {
        // Find all agents in the db and create a instance of their implementation
        const agents = await prisma.agents();

        for (let agent of agents) {
            Init.serviceHost.loadAgent(agent);
        }
    }

    private static async createSystemTopics() {
        Helper.log(`Creating system topics ...`);
        Init._newChannelTopic = EventBroker.instance.createTopic<Channel>("system", Topics.NewChannel);
        Init._newEntryTopic = EventBroker.instance.createTopic<Entry>("system", Topics.NewEntry);
        Init._newRoomTopic = EventBroker.instance.createTopic<Group>("system", Topics.NewRoom);

        Init._newChannelTopic.observable.subscribe(newChannel => {
            // Notify the receiving end of the channel (every agent uses its own namespace and provides some default topics)
            const newChannelTopic = EventBroker.instance.tryGetTopic<Channel>(newChannel.receiver.id, Topics.NewChannel);
            if (newChannelTopic) {
                newChannelTopic.publish(newChannel);
            }
        });

        Init._newRoomTopic.observable.subscribe(async newRoom => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.room(newRoom.id);

            for (let subscriber of subscribers) {
                const newRoomTopic = EventBroker.instance.tryGetTopic<Group>(subscriber, Topics.NewRoom);
                if (newRoomTopic) {
                    newRoomTopic.publish(newRoom);
                }
            }
        });

        Init._newEntryTopic.depend(async newEntry => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.entry(newEntry.id);

            for (let subscriber of subscribers) {
                const newEntryTopic = EventBroker.instance.tryGetTopic<Entry>(subscriber, Topics.NewEntry);
                if (newEntryTopic) {
                    // TODO: This can propagate the errors of services to this position
                    // TODO: Monitor performance
                    await newEntryTopic.publish(newEntry);
                }
            }
        });
    }

    private static async createSystemUser() {
        Init._systemUser = await prisma.user({email: config.env.systemUser});
        if (Init._systemUser) {
            return;
        }

        Helper.log(`Creating system user`);
        Init._systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    private static async createAnonymousUser() {
        Init._anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (Init._anonymousUser) {
            return;
        }

        Helper.log(`Creating anonymous user`);
        Init._anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    private static async createServices() {
        const path = require('path');
        const dir = path.join(__dirname, "init", "singletonServices") + "/";

        await Promise.all(Init.loadModules(dir).map(Init.insertAgentIfNotExisting));
    }

    private static async insertAgentIfNotExisting(agent:any) {
        const implementation = agent.implementation;

        delete agent.implementation;
        agent.implementation = agent.name; // TODO: Deprecated!?

        const existingService = await prisma.agents({where: {name: agent.name, type: "Service"}});
        let persistedService = null;

        if (existingService.length > 0) {
            Helper.log(`   Service '${agent.name}' is already registered.`);
            persistedService = existingService[0];
        } else {
            Helper.log(`   Registering service '${agent.name}' ..`);

            persistedService = await prisma.createAgent(agent);
            await prisma.updateUser({
                where: {
                    id: agent.owner
                },
                data: {
                    agents: {
                        connect: {
                            id: persistedService.id
                        }
                    }
                }
            });
            Helper.log(`   Registered service '${agent.name}' with owner '${persistedService.owner}'.`);
        }

        Init.serviceHost.serviceImplementations[agent.name]
            = (eventBroker: EventBroker, agent: Agent) => new implementation(eventBroker, agent);

        Init._serviceIdMap[agent.id] = persistedService;
        Init._serviceNameMap[agent.name] = persistedService;
    }

    private static async createContentEncodings() {
        const path = require('path');
        const dir = path.join(__dirname, "init", "contentEncodings") + "/";

        await Promise.all(Init.loadModules(dir).map(Init.insertContentEncodingIfNotExisting));

        if (Object.keys(Init._contentEncodingsIdMap).length != Object.keys(Init._contentEncodingsNameMap).length) {
            throw new Error(`ContentEncoding names must be unique: ${this.contentEncodings.map(o => o.name).join(", ")}`);
        }
    }

    private static async insertContentEncodingIfNotExisting(contentEncoding:ContentEncoding) {
        const existingContentEncoding = await prisma.contentEncodings({where: {name: contentEncoding.name}});

        let persistedContentEncoding: ContentEncoding = null;
        if (existingContentEncoding.length > 0) {
            persistedContentEncoding = existingContentEncoding[0];
        } else {
            Helper.log(`   Content encoding '${contentEncoding.name}' is new. Creating in prisma ..`);
            persistedContentEncoding = await prisma.createContentEncoding(contentEncoding);
        }

        Init._contentEncodingsNameMap[persistedContentEncoding.name] = persistedContentEncoding;
        Init._contentEncodingsIdMap[persistedContentEncoding.id] = persistedContentEncoding;
    }

    private static async createCountryEntries() {
        const path = require('path');
        const dir = path.join(__dirname, "init", "systemEntries", "countriesGeoJson") + "/";

        await Promise.all(Init.loadModules(dir).map(Init.insertCountryEntryIfNotExisting));
    }

    private static async insertCountryEntryIfNotExisting(geojson:any) {
        const countryName = geojson.properties.sovereignt;

        const existingContentEncoding = await prisma.group({id:Init._countriesSystemRoom.id}).entries({
            where: {
                name: countryName
            }
        });

        if (existingContentEncoding.length > 0) {
            console.log(`   Country '${countryName}' already exists.`);
            return;
        }

        const newEntry = await AgentCreate.entry(
            Init.datenDieterSystemAgent.id,
            Init._countriesSystemRoom.id,
            {
                contentEncoding: Init.geoJsonFeatureContentEncoding.id,
                createdBy: Init.systemUser.id,
                owner: Init.systemUser.id,
                type: "Json",
                name: countryName,
                content: geojson
            });

        console.log(`   Created entry '${newEntry.id}' for country '${countryName}' in group system room '${Init._countriesSystemRoom.id}'.`);
    }

    private static loadModules(path:string) {
        const {readdirSync} = require('fs');

        Helper.log(`Trying to load modules from '${path}' ...`);

        return readdirSync(path, {withFileTypes: true})
            .filter(fsItem => fsItem.isFile()
                && fsItem.name.length > 3
                && fsItem.name.substr (fsItem.name.length - 3, 3).toLowerCase() == ".js")
            .map(fsItem => {
                try {
                    Helper.log(`   Loading '${path}${fsItem.name}' ...`);
                    return require(`${path}${fsItem.name}`).Index;
                } catch (e) {
                    Helper.log(`   Error: ${e}`);
                }
            })
            .filter(mod => mod !== undefined);
    }
}