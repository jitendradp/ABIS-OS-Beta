import {Agent, ContentEncoding, Entry, Group, prisma, User} from "./generated";
import {config} from "./config";
import {EventBroker, Topic, Topics} from "./services/eventBroker";
import {Helper} from "./helper/helper";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {AgentHost, ServiceFactory} from "./services/agentHost";
import {Channel} from "./api/types/channel";
import {UserCreate} from "./data/mutations/userCreate";
import {AgentCreate} from "./data/mutations/agentCreate";

export class Init {
    static get serviceHost(): AgentHost {
        return this._serviceHost;
    }

    static get systemUser(): User {
        return this._systemUser;
    }

    static get anonymousUser(): User {
        return this._anonymousUser;
    }

    static get signupService(): Agent {
        return this._signupService;
    }

    static get loginService(): Agent {
        return this._loginService;
    }

    static get verifyEmailService(): Agent {
        return this._verifyEmailService;
    }

    static get datenDieterSystemAgent(): Agent {
        return this._datenDieterSystemAgent;
    }

    static get newChannelTopic(): Topic<Channel> {
        return this._newChannelTopic;
    }

    static get newEntryTopic(): Topic<Entry> {
        return this._newEntryTopic;
    }

    static get newRoomTopic(): Topic<Group> {
        return this._newRoomTopic;
    }

    static get signupContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Signup"];
    }

    static get verifyEmailContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["VerifyEmail"];
    }

    static get loginContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Login"];
    }

    static get errorContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Error"];
    }

    static get continuationContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["Continuation"];
    }

    static get geoJsonFeatureContentEncoding(): ContentEncoding {
        return this.contentEncodingsNameMap["GeoJsonFeature"];
    }

    static get contentEncodings(): ContentEncoding[] {
        return Object.keys(this._contentEncodingsIdMap).map(id => this._contentEncodingsIdMap[id]);
    }
    static get contentEncodingsNameMap(): {[name:string]:ContentEncoding} {
        return this._contentEncodingsNameMap;
    }
    static get contentEncodingsIdMap(): {[name:string]:ContentEncoding} {
        return this._contentEncodingsIdMap;
    }

    private static _systemUser: User;
    private static _anonymousUser: User;
    private static _signupService: Agent;
    private static _loginService: Agent;
    private static _verifyEmailService: Agent;
    private static _datenDieterSystemAgent: Agent;
    private static _newChannelTopic: Topic<Channel>;
    private static _newEntryTopic: Topic<Entry>;
    private static _newRoomTopic: Topic<Group>;
    private static _countriesSystemRoom: Group;

    private static _contentEncodingsNameMap: {[name:string]:ContentEncoding} = {};
    private static _contentEncodingsIdMap: {[id:string]:ContentEncoding} = {};

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
        const existingDatenDieter = await prisma.agents({where:{owner:Init._systemUser.id, name: "DatenDieter"}});
        if (existingDatenDieter.length == 0) {
            Init._datenDieterSystemAgent = await UserCreate.profile(Init._systemUser.id, "DatenDieter", "avatar.png", "Available");
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
        const {readdirSync} = require('fs');
        const path = require('path');

        const dir = path.join(__dirname, "init", "singletonServices") + "/";

        Helper.log(`Trying to load the services from '${dir}' ...`);

        const loadedServices = await readdirSync(dir, {withFileTypes: true})
            .filter(o => o.isFile() && o.name.endsWith(".js"))
            .map(async o => {

                Helper.log(`Trying to load service '${o.name}' ...`);

                const obj = await require(`${dir}${o.name}`);
                return {
                    path: `${dir}/${o.name}`,
                    object: obj.Index
                }
            });

        for (const file of loadedServices) {
            const loadedService = (await file).object;
            const implementation = loadedService.implementation;

            Helper.log(`Loaded service '${loadedService.name}'. Registering if necessary and starting up ..`);

            delete loadedService.implementation;
            loadedService.implementation = loadedService.name; // TODO: Deprecated!?

            const existingService = await prisma.agents({where: {name: loadedService.name, type: "Service"}});
            if (existingService.length > 0) {
                Helper.log(`   Service '${loadedService.name}' is already registered.`);
            } else {
                Helper.log(`   Registering service '${loadedService.name}' ..`);

                const persistedService = await prisma.createAgent(loadedService);
                await prisma.updateUser({
                    where: {
                        id: loadedService.owner
                    },
                    data: {
                        agents: {
                            connect: {
                                id: persistedService.id
                            }
                        }
                    }
                });
                Helper.log(`   Registered service '${loadedService.name}' with owner '${persistedService.owner}'.`);
            }

            this.serviceHost.serviceImplementations[loadedService.name]
                = (eventBroker: EventBroker, agent: Agent) => new implementation(eventBroker, agent);
        }
    }

    private static async createCountryEntries() {
        const fs = require('fs');
        const {readdirSync} = require('fs');
        const path = require('path');

        const dir = path.join(__dirname, "..", "src", "init", "systemEntries", "countriesGeoJson") + "/";

        Helper.log(`Trying to create the system entries from directory '${dir}' ...`);

        const files = readdirSync(dir, {withFileTypes: true})
            .filter(o => o.isFile())
            .map(o => {
                return {path: `${dir}/${o.name}`, name: o.name}
            });

        files.forEach(file => {
            fs.readFile(file.path, async (err, data) => {
                if (err) {
                    console.error(err);
                    return
                }

                const countryName = file.name.replace(".json", "");
                await AgentCreate.entry(Init._datenDieterSystemAgent.id, Init._countriesSystemRoom.id, {
                    contentEncoding: Init.geoJsonFeatureContentEncoding.id,
                    createdBy: Init._systemUser.id,
                    owner: Init._systemUser.id,
                    type: "Json",
                    name: countryName,
                    content: JSON.parse(data)
                });

                console.log("Created entry for country: " + countryName);
            });
        });
    }

    private static async createContentEncodings() {
        const {readdirSync} = require('fs');
        const path = require('path');

        const dir = path.join(__dirname, "init", "contentEncodings") + "/";

        Helper.log(`Trying to load the content encodings from '${dir}' ...`);

        const loadedEncodings = await readdirSync(dir, {withFileTypes: true})
            .filter(o => o.isFile() && o.name.endsWith(".js"))
            .map(async o => {

                Helper.log(`Trying to load content encoding '${o.name}' ...`);

                let obj = await require(`${dir}${o.name}`);
                return {
                    path: `${dir}/${o.name}`,
                    object: <ContentEncoding>obj.Index
                }
            });

        for (const file of loadedEncodings) {
            const loadedContentEncoding = (await file).object;

            Helper.log(`Loaded content encoding '${loadedContentEncoding.name}'.`);

            const existingContentEncoding = await prisma.contentEncodings({where:{name:loadedContentEncoding.name}});

            let persistedContentEncoding:ContentEncoding = null;

            if (existingContentEncoding.length > 0) {
                persistedContentEncoding = existingContentEncoding[0];
            } else {
                Helper.log(`   Content encoding '${loadedContentEncoding.name}' is new. Creating in prisma ..`);
                persistedContentEncoding = await prisma.createContentEncoding(loadedContentEncoding);
                Helper.log(`   Created content encoding '${loadedContentEncoding.name}' in prisma.`);
            }

            this._contentEncodingsNameMap[persistedContentEncoding.name] = persistedContentEncoding;
            this._contentEncodingsIdMap[persistedContentEncoding.id] = persistedContentEncoding;
        }

        if (Object.keys(this._contentEncodingsIdMap).length != Object.keys(this._contentEncodingsNameMap).length) {
            throw new Error(`ContentEncoding names must be unique: ${this.contentEncodings.map(o => o.name).join(", ")}`);
        }
    }
}
