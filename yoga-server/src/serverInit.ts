import {Agent, ContentEncoding, Entry, Group, prisma, User} from "./generated";
import {config} from "./config";
import {ContentEncodings} from "./contentEncodings";
import {EventBroker, Topic, Topics} from "./services/eventBroker";
import {NewChannel} from "./services/events/newChannel";
import {Helper} from "./helper/helper";
import {NewEntry} from "./services/events/newEntry";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {AgentHost} from "./services/agentHost";
import {Channel} from "./api/types/channel";
import {UserCreate} from "./data/mutations/userCreate";
import {AgentCreate} from "./data/mutations/agentCreate";

export class ServerInit {
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

    static get signupContentEncoding(): ContentEncoding {
        return this._signupContentEncoding;
    }

    static get verifyEmailContentEncoding(): ContentEncoding {
        return this._verifyEmailContentEncoding;
    }

    static get loginContentEncoding(): ContentEncoding {
        return this._loginContentEncoding;
    }

    static get errorContentEncoding(): ContentEncoding {
        return this._errorContentEncoding;
    }

    static get continuationContentEncoding(): ContentEncoding {
        return this._continuationContentEncoding;
    }

    static get geoJsonFeatureContentEncoding(): ContentEncoding {
        return this._geoJsonFeatureContentEncoding;
    }

    static get contentEncodings(): ContentEncoding[] {
        return [
            this.signupContentEncoding,
            this.verifyEmailContentEncoding,
            this.loginContentEncoding,
            this.errorContentEncoding,
            this.continuationContentEncoding,
            this.geoJsonFeatureContentEncoding
        ]
    }

    private static _systemUser: User;
    private static _anonymousUser: User;
    private static _signupService: Agent;
    private static _loginService: Agent;
    private static _verifyEmailService: Agent;
    private static _datenDieterSystemAgent: Agent;
    private static _newChannelTopic: Topic<Channel>;
    private static _newEntryTopic: Topic<Entry>;
    private static _signupContentEncoding: ContentEncoding;
    private static _verifyEmailContentEncoding: ContentEncoding;
    private static _loginContentEncoding: ContentEncoding;
    private static _errorContentEncoding: ContentEncoding;
    private static _continuationContentEncoding: ContentEncoding;
    private static _geoJsonFeatureContentEncoding: ContentEncoding;
    private static _countriesSystemRoom: Group;

    private static _serviceHost = new AgentHost(EventBroker.instance);

    public static async run() {
        await ServerInit.createSystemUser();
        await ServerInit.createAnonymousUser();

        await ServerInit.clearAnonymousProfilesAndSessions();

        await ServerInit.createContentEncodings();

        await ServerInit.createSystemAgents();

        await ServerInit.createSignupService();
        await ServerInit.createVerifyEmailService();
        await ServerInit.createLoginService();
        await ServerInit.createSystemTopics();

        await ServerInit.loadAgents();

        await ServerInit.createSystemGroups();
    }

    private static async createSystemAgents() {
        const existingDatenDieter = await prisma.agents({where:{owner:ServerInit._systemUser.id, name: "DatenDieter"}});
        if (existingDatenDieter.length == 0) {
            ServerInit._datenDieterSystemAgent = await UserCreate.profile(ServerInit._systemUser.id, "DatenDieter", "avatar.png", "Available");
        } else {
            ServerInit._datenDieterSystemAgent = existingDatenDieter[0];
        }
    }

    private static async createSystemGroups() {
        const existingCountriesSystemRoom = await prisma.groups({where:{owner:ServerInit._datenDieterSystemAgent.id, type:"Room", name:"Countries"}});
        if (existingCountriesSystemRoom.length == 0) {
            ServerInit._countriesSystemRoom = await AgentCreate.room(ServerInit._datenDieterSystemAgent.id, "Countries", "logo.png", true);
            await ServerInit.createCountryEntries();
        } else {
            ServerInit._countriesSystemRoom = existingCountriesSystemRoom[0];
        }
    }

    private static async createCountryEntries() {
        const fs = require('fs');
        const {readdirSync} = require('fs');

        const dir = '/home/daniel/src/ABIS-OS-Beta/yoga-server/data/systemEntries/countriesGeoJson/';

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
                await AgentCreate.entry(ServerInit._datenDieterSystemAgent.id, ServerInit._countriesSystemRoom.id, {
                    contentEncoding: ServerInit._geoJsonFeatureContentEncoding.id,
                    createdBy: ServerInit._systemUser.id,
                    owner: ServerInit._systemUser.id,
                    type: "Json",
                    name: countryName,
                    content: JSON.parse(data)
                });

                console.log("Created entry for country: " + countryName);
            });
        });
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
            ServerInit.serviceHost.loadAgent(agent);
        }
    }

    private static async createSystemTopics() {
        ServerInit._newChannelTopic = EventBroker.instance.createTopic<Channel>("system", Topics.NewChannel);
        ServerInit._newEntryTopic = EventBroker.instance.createTopic<Entry>("system", Topics.NewEntry);

        ServerInit._newChannelTopic.observable.subscribe(newChannel => {
            // Notify the receiving end of the channel (every agent uses its own namespace and provides some default topics)
            const newChannelTopic = EventBroker.instance.tryGetTopic<Channel>(newChannel.receiver.id, Topics.NewChannel);
            if (newChannelTopic) {
                newChannelTopic.publish(newChannel);
            }
        });

        ServerInit._newEntryTopic.depend(async newEntry => {
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
        ServerInit._systemUser = await prisma.user({email: config.env.systemUser});
        if (ServerInit._systemUser) {
            return;
        }

        Helper.log(`Creating system user`);
        ServerInit._systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    private static async createAnonymousUser() {
        ServerInit._anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (ServerInit._anonymousUser) {
            return;
        }

        Helper.log(`Creating anonymous user`);
        ServerInit._anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    private static async createSignupService() {
        const signupServices = await prisma.agents({where: {name: "SignupService", type: "Service"}});
        if (signupServices.length > 0) {
            ServerInit._signupService = signupServices[0];
            return;
        }

        Helper.log(`Creating signup service`);
        const signupService = await prisma.createAgent({
            owner: ServerInit._systemUser.id,
            createdBy: ServerInit._systemUser.id,
            name: "SignupService",
            status: "Running",
            type: "Service",
            implementation: "SignupService",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: ServerInit._systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupService.id
                    }
                }
            }
        });

        ServerInit._signupService = signupService;
    }

    private static async createLoginService() {
        const loginServices = await prisma.agents({where: {name: "LoginService", type: "Service"}});
        if (loginServices.length > 0) {
            ServerInit._loginService = loginServices[0];
            return;
        }

        Helper.log(`Creating login service`);
        const loginService = await prisma.createAgent({
            owner: ServerInit._systemUser.id,
            createdBy: ServerInit._systemUser.id,
            name: "LoginService",
            status: "Running",
            type: "Service",
            implementation: "LoginService",
            serviceDescription: "Handles the login requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: ServerInit._systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: loginService.id
                    }
                }
            }
        });

        ServerInit._loginService = loginService;
    }

    private static async createVerifyEmailService() {
        const verifyEmailServices = await prisma.agents({where: {name: "VerifyEmailService", type: "Service"}});
        if (verifyEmailServices.length > 0) {
            ServerInit._verifyEmailService = verifyEmailServices[0];
            return;
        }

        Helper.log(`Creating verifyEmail service`);
        const verifyEmaulService = await prisma.createAgent({
            owner: ServerInit._systemUser.id,
            createdBy: ServerInit._systemUser.id,
            name: "VerifyEmailService",
            status: "Running",
            type: "Service",
            implementation: "VerifyEmailService",
            serviceDescription: "Handles the login requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: ServerInit._systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: verifyEmaulService.id
                    }
                }
            }
        });

        ServerInit._verifyEmailService = verifyEmaulService;
    }

    private static async createContentEncodings() {
        const existingSignupContentEncoding = await prisma.contentEncodings({where: {name: "Signup"}});
        if (existingSignupContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
            ServerInit._signupContentEncoding = await prisma.createContentEncoding(ContentEncodings.Signup);
        } else {
            ServerInit._signupContentEncoding = existingSignupContentEncoding[0];
        }

        const existingVerifyEmailContentEncoding = await prisma.contentEncodings({where: {name: "VerifyEmail"}});
        if (existingVerifyEmailContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: VerifyEmail/JsonSchema`);
            ServerInit._verifyEmailContentEncoding = await prisma.createContentEncoding(ContentEncodings.VerifyEmail);
        } else {
            ServerInit._verifyEmailContentEncoding = existingSignupContentEncoding[0];
        }

        const existingLoginContentEncoding = await prisma.contentEncodings({where: {name: "Login"}});
        if (existingLoginContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Login/JsonSchema`);
            ServerInit._loginContentEncoding = await prisma.createContentEncoding(ContentEncodings.Login);
        } else {
            ServerInit._loginContentEncoding = existingLoginContentEncoding[0];
        }

        const existingErrorContentEncoding = await prisma.contentEncodings({where: {name: "Error"}});
        if (existingErrorContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Error/JsonSchema`);
            ServerInit._errorContentEncoding = await prisma.createContentEncoding(ContentEncodings.Error);
        } else {
            ServerInit._errorContentEncoding = existingErrorContentEncoding[0];
        }

        const existingContinuationContentEncoding = await prisma.contentEncodings({where: {name: "Continuation"}});
        if (existingContinuationContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Continuation/JsonSchema`);
            ServerInit._continuationContentEncoding = await prisma.createContentEncoding(ContentEncodings.Continuation);
        } else {
            ServerInit._continuationContentEncoding = existingContinuationContentEncoding[0];
        }

        const existingGeoJsonFeatureContentEncoding = await prisma.contentEncodings({where: {name: "GeoJsonFeature"}});
        if (existingGeoJsonFeatureContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: GeoJsonFeature/JsonSchema`);
            ServerInit._geoJsonFeatureContentEncoding = await prisma.createContentEncoding(ContentEncodings.GeoJsonFeature);
        } else {
            ServerInit._geoJsonFeatureContentEncoding = existingGeoJsonFeatureContentEncoding[0];
        }
    }
}
