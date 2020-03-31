import {Agent, ContentEncoding, Entry, Group, prisma, User} from "./generated/prisma_client";
import {config} from "./config";
import {EventBroker, Topic, Topics} from "./services/eventBroker";
import {Helper} from "./helper/helper";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {AgentHost} from "./services/agentHost";
import {Channel} from "./api/types/channel";
import {UserCreate} from "./data/mutations/userCreate";
import {AgentCreate} from "./data/mutations/agentCreate";
import {Service} from "./services/service";

const isInTest = typeof global.it === 'function';

export class Server {
    get eventBroker(): EventBroker {
        return this._eventBroker;
    };

    get serviceHost(): AgentHost {
        return this._serviceHost;
    }

    get systemUser(): User {
        return this._systemUser;
    }

    get anonymousUser(): User {
        return this._anonymousUser;
    }

    get signupServiceId(): string {
        return this._serviceNameMap["SignupService"].id;
    }

    get loginServiceId(): string {
        return this._serviceNameMap["LoginService"].id;
    }

    get verifyEmailServiceId(): string {
        return this._serviceNameMap["VerifyEmailService"].id;
    }

    get datenDieterSystemAgent(): Agent {
        return this._datenDieterSystemAgent;
    }

    get newChannelTopic(): Topic<Channel> {
        return this._newChannelTopic;
    }

    get newEntryTopic(): Topic<Entry> {
        return this._newEntryTopic;
    }

    get newRoomTopic(): Topic<Group> {
        return this._newRoomTopic;
    }

    get signupContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Signup"];
    }

    get verifyEmailContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["VerifyEmail"];
    }

    get loginContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Login"];
    }

    get errorContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Error"];
    }

    get continuationContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Continuation"];
    }

    get geoJsonFeatureContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["GeoJsonFeature"];
    }

    get contentEncodings(): ContentEncoding[] {
        return Object.keys(this._contentEncodingsIdMap).map(id => this._contentEncodingsIdMap[id]);
    }
    get contentEncodingsNameMap(): {[name:string]:ContentEncoding} {
        return this._contentEncodingsNameMap;
    }
    get contentEncodingsIdMap(): {[name:string]:ContentEncoding} {
        return this._contentEncodingsIdMap;
    }

    private _systemUser: User;
    private _anonymousUser: User;
    private _datenDieterSystemAgent: Agent;
    private _newChannelTopic: Topic<Channel>;
    private _newEntryTopic: Topic<Entry>;
    private _newRoomTopic: Topic<Group>;
    private _countriesSystemRoom: Group;
    private _eventBroker: EventBroker;

    private _contentEncodingsNameMap: {[name:string]:ContentEncoding} = {};
    private _contentEncodingsIdMap: {[id:string]:ContentEncoding} = {};

    private _serviceNameMap: {[name:string]:Service} = {};
    private _serviceIdMap: {[id:string]:Service} = {};
    private _serviceHost: AgentHost;

    constructor() {
        this._eventBroker = new EventBroker();
        this._serviceHost = new AgentHost(this);
    }

    public async run() {
        await this.createSystemUser();
        await this.createAnonymousUser();

        await this.clearAnonymousProfilesAndSessions();

        await this.createContentEncodings();

        await this.createSystemAgents();

        await this.createServices();
        await this.createSystemTopics();

        await this.loadAgents();

        await this.createSystemGroups();
    }

    private async createSystemAgents() {
        const existingDatenDieter = await prisma.agents({where:{owner:this._systemUser.id, name: "Daten Dieter"}});
        if (existingDatenDieter.length == 0) {
            this._datenDieterSystemAgent = await UserCreate.profile(this._systemUser.id, "Daten Dieter", "avatar.png", "Available", this);
        } else {
            this._datenDieterSystemAgent = existingDatenDieter[0];
        }
    }

    private async createSystemGroups() {
        const existingCountriesSystemRoom = await prisma.groups({where:{owner:this._datenDieterSystemAgent.id, type:"Room", name:"Countries"}});
        if (existingCountriesSystemRoom.length == 0) {
            this._countriesSystemRoom = await AgentCreate.room(this, this._datenDieterSystemAgent.id, "Countries", "logo.png", true);
            await this.createCountryEntries();
        } else {
            this._countriesSystemRoom = existingCountriesSystemRoom[0];
        }
    }

    private async clearAnonymousProfilesAndSessions() {

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
    async loadAgents() {
        // Find all agents in the db and create a instance of their implementation
        const agents = await prisma.agents();

        for (let agent of agents) {
            this.serviceHost.loadAgent(agent);
        }
    }

    async createSystemTopics() {
        Helper.log(`Creating system topics ...`);
        this._newChannelTopic = this.eventBroker.createTopic<Channel>("system", Topics.NewChannel);
        this._newEntryTopic = this.eventBroker.createTopic<Entry>("system", Topics.NewEntry);
        this._newRoomTopic = this.eventBroker.createTopic<Group>("system", Topics.NewRoom);

        this._newChannelTopic.observable.subscribe(newChannel => {
            // Notify the receiving end of the channel (every agent uses its own namespace and provides some default topics)
            const newChannelTopic = this.eventBroker.tryGetTopic<Channel>(newChannel.receiver.id, Topics.NewChannel);
            if (newChannelTopic) {
                newChannelTopic.publish(newChannel);
            }
        });

        this._newRoomTopic.observable.subscribe(async newRoom => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.room(newRoom.id);

            for (let subscriber of subscribers) {
                const newRoomTopic = this.eventBroker.tryGetTopic<Group>(subscriber, Topics.NewRoom);
                if (newRoomTopic) {
                    newRoomTopic.publish(newRoom);
                }
            }
        });

        this._newEntryTopic.depend(async newEntry => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.entry(newEntry.id);

            for (let subscriber of subscribers) {
                const newEntryTopic = this.eventBroker.tryGetTopic<Entry>(subscriber, Topics.NewEntry);
                if (newEntryTopic) {
                    // TODO: This can propagate the errors of services to this position
                    // TODO: Monitor performance
                    await newEntryTopic.publish(newEntry);
                }
            }
        });
    }

    async createSystemUser() {  // TODO: Not nicely testable. Should be private.
        this._systemUser = await prisma.user({email: config.env.systemUser});
        if (this._systemUser) {
            return;
        }

        Helper.log(`Creating system user`);
        this._systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    async createAnonymousUser() {  // TODO: Not nicely testable. Should be private.
        this._anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (this._anonymousUser) {
            return;
        }

        Helper.log(`Creating anonymous user`);
        this._anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    async createServices(fromPath?:string) { // TODO: Not nicely testable. Should be private.
        const path = require('path');
        let dir = path.join(fromPath ?? __dirname, "init", "singletonServices") + "/";

        const self = this;
        await Promise.all(this.loadModules(dir).map((loadedService) => self.insertAgentIfNotExisting(loadedService)));
    }

    private async insertAgentIfNotExisting(agent:any) {
        const implementation = agent.implementation;

        agent.owner = Init.systemUser.id;
        agent.createdBy = Init.systemUser.id;

        const existingService = await prisma.agents({where: {name: agent.name, type: "Service"}});
        let persistedService = null;

        if (existingService.length > 0) {
            Helper.log(`   Service '${agent.name}' is already registered.`);
            persistedService = existingService[0];
        } else {
            Helper.log(`   Registering service '${agent.name}' ..`);

            delete agent.implementation;
            agent.implementation = agent.name; // TODO: Deprecated!?

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

        this.serviceHost.serviceImplementations[agent.name]
            = (server: Server, agent: Agent) => new implementation(server, agent);

        this._serviceIdMap[persistedService.id] = persistedService;
        this._serviceNameMap[persistedService.name] = persistedService;
    }

    async createContentEncodings(fromPath?:string) { // TODO: Not nicely testable. Should be private.
        const path = require('path');
        let dir = path.join(fromPath ?? __dirname, "init", "contentEncodings") + "/";
        if (isInTest) {
            dir += "../../../dist/init/contentEncodings/";
        }

        const self = this;
        await Promise.all(this.loadModules(dir).map(loadedContentEncoding => self.insertContentEncodingIfNotExisting(loadedContentEncoding)));

        if (Object.keys(this._contentEncodingsIdMap).length != Object.keys(this._contentEncodingsNameMap).length) {
            throw new Error(`ContentEncoding names must be unique: ${this.contentEncodings.map(o => o.name).join(", ")}`);
        }
    }

    private async insertContentEncodingIfNotExisting(contentEncoding:ContentEncoding) {
        const existingContentEncoding = await prisma.contentEncodings({where: {name: contentEncoding.name}});

        let persistedContentEncoding: ContentEncoding = null;
        if (existingContentEncoding.length > 0) {
            persistedContentEncoding = existingContentEncoding[0];
            Helper.log(`   Content encoding '${contentEncoding.name}' is already registered.`);
        } else {
            Helper.log(`   Content encoding '${contentEncoding.name}' is new. Creating in prisma ..`);
            persistedContentEncoding = await prisma.createContentEncoding(contentEncoding);
        }

        this._contentEncodingsNameMap[persistedContentEncoding.name] = persistedContentEncoding;
        this._contentEncodingsIdMap[persistedContentEncoding.id] = persistedContentEncoding;
    }

    private async createCountryEntries() {
        const path = require('path');
        const dir = path.join(__dirname, "init", "systemEntries", "countriesGeoJson") + "/";

        const self = this;
        await Promise.all(this.loadModules(dir).map(loadedCountry => self.insertCountryEntryIfNotExisting(loadedCountry)));
    }

    private async insertCountryEntryIfNotExisting(geojson:any) {
        const countryName = geojson.properties.sovereignt;

        const existingContentEncoding = await prisma.group({id:this._countriesSystemRoom.id}).entries({
            where: {
                name: countryName
            }
        });

        if (existingContentEncoding.length > 0) {
            console.log(`   Country '${countryName}' already exists.`);
            return;
        }

        const newEntry = await AgentCreate.entry(
            this,
            this.datenDieterSystemAgent.id,
            this._countriesSystemRoom.id,
            {
                contentEncoding: this.geoJsonFeatureContentEncoding.id,
                createdBy: this.systemUser.id,
                owner: this.systemUser.id,
                type: "Json",
                name: countryName,
                content: geojson
            });

        console.log(`   Created entry '${newEntry.id}' for country '${countryName}' in group system room '${this._countriesSystemRoom.id}'.`);
    }

    private loadModules(path:string) {
        const {readdirSync} = require('fs');

        Helper.log(`Trying to load modules from '${path}' ...`);

        return readdirSync(path, {withFileTypes: true})
            .filter(fsItem => fsItem.isFile()
                && fsItem.name.length > 3
                && fsItem.name.substr (fsItem.name.length - 3, 3).toLowerCase() == ".js")
            .map(fsItem => {
                try {
                    Helper.log(`   Loading '${path}${fsItem.name}' ...`);
                    const required = require(`${path}${fsItem.name}`);
                    return required.Index;
                } catch (e) {
                    Helper.log(`   Error: ${e}`);
                }
            })
            .filter(mod => mod !== undefined);
    }
}

export const Init = new Server();