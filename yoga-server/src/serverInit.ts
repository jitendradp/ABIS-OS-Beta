import {Agent, ContentEncoding, Entry, prisma, User} from "./generated/prisma_client";
import {config} from "./config";
import {ContentEncodings} from "./api/contentEncodings";
import {EventBroker, Topic, Topics} from "./services/eventBroker";
import {NewChannel} from "./services/events/newChannel";
import {Helper} from "./helper/helper";
import {NewEntry} from "./services/events/newEntry";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {AgentHost} from "./services/agentHost";
import {Channel} from "./api/types/channel";

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
    static get validationErrorContentEncoding(): ContentEncoding {
        return this._validationErrorContentEncoding;
    }
    static get continuationContentEncoding(): ContentEncoding {
        return this._continuationContentEncoding;
    }
    private static _systemUser:User;
    private static _anonymousUser:User;
    private static _signupService:Agent;
    private static _loginService:Agent;
    private static _newChannelTopic:Topic<Channel>;
    private static _newEntryTopic:Topic<Entry>;
    private static _signupContentEncoding: ContentEncoding;
    private static _verifyEmailContentEncoding: ContentEncoding;
    private static _loginContentEncoding: ContentEncoding;
    private static _validationErrorContentEncoding: ContentEncoding;
    private static _continuationContentEncoding: ContentEncoding;

    private static _serviceHost = new AgentHost(EventBroker.instance);

    public static async run() {
        await ServerInit.createSystemUser();
        await ServerInit.createAnonymousUser();

        await ServerInit.clearAnonymousProfilesAndSessions();

        await ServerInit.createContentEncodings();
        await ServerInit.createSignupService();
        await ServerInit.createLoginService();
        await ServerInit.createSystemTopics();

        await ServerInit.loadAgents();
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
        const anonSessions = await prisma.sessions({where:{user:{id:this.anonymousUser.id}}});
        await prisma.deleteManySessions({id_in:anonSessions.map(o => o.id)});

        // Find all anonymous agents and get their ids
        const anonAgents = await prisma.user({id:this.anonymousUser.id}).agents();
        const anonAgentIds = anonAgents.map(o => o.id);

        // Find all channels that have been created to anonymous agents
        const channelsToAnonProfiles = await prisma.groups({where:{type:"Channel", memberships_every:{member:{id_in:anonAgentIds}}}});

        // Delete all channels that have been created in the direction to an anon profile
        await prisma.deleteManyGroups({id_in:channelsToAnonProfiles.map(o => o.id)});

        // Delete all groups that have been created by anonymous agents
        await prisma.deleteManyGroups({owner_in:anonAgentIds});

        // Delete all anonymous agents
        await prisma.deleteManyAgents({id_in:anonAgentIds});
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

        ServerInit._newEntryTopic.observable.subscribe(async newEntry => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.entry(newEntry.id);

            for (let subscriber of subscribers) {
                const newEntryTopic = EventBroker.instance.tryGetTopic<Entry>(subscriber, Topics.NewEntry);
                if (newEntryTopic) {
                    newEntryTopic.publish(newEntry);
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
        const signupServices = await prisma.agents({where:{name: "SignupService", type: "Service"}});
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
        const loginServices = await prisma.agents({where:{name: "LoginService", type: "Service"}});
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

    private static async createContentEncodings() {
        const existingSignupContentEncoding = await  prisma.contentEncodings({where:{name:"Signup"}});
        if (existingSignupContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
            ServerInit._signupContentEncoding = await prisma.createContentEncoding(ContentEncodings.Signup);
        } else {
            ServerInit._signupContentEncoding = existingSignupContentEncoding[0];
        }

        const existingVerifyEmailContentEncoding = await  prisma.contentEncodings({where:{name:"VerifyEmail"}});
        if (existingVerifyEmailContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: VerifyEmail/JsonSchema`);
            ServerInit._verifyEmailContentEncoding = await prisma.createContentEncoding(ContentEncodings.VerifyEmail);
        } else {
            ServerInit._verifyEmailContentEncoding = existingSignupContentEncoding[0];
        }

        const existingLoginContentEncoding = await  prisma.contentEncodings({where:{name:"Login"}});
        if (existingLoginContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Login/JsonSchema`);
            ServerInit._loginContentEncoding = await prisma.createContentEncoding(ContentEncodings.Login);
        } else {
            ServerInit._loginContentEncoding = existingLoginContentEncoding[0];
        }

        const existingValidationErrorContentEncoding = await  prisma.contentEncodings({where:{name:"ValidationError"}});
        if (existingValidationErrorContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: ValidationError/Custom`);
            ServerInit._validationErrorContentEncoding = await prisma.createContentEncoding(ContentEncodings.ValidationError);
        } else {
            ServerInit._validationErrorContentEncoding = existingValidationErrorContentEncoding[0];
        }

        const existingContinuationContentEncoding = await  prisma.contentEncodings({where:{name:"Continuation"}});
        if (existingContinuationContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Continuation/Custom`);
            ServerInit._continuationContentEncoding = await prisma.createContentEncoding(ContentEncodings.Continuation);
        } else {
            ServerInit._continuationContentEncoding = existingContinuationContentEncoding[0];
        }
    }
}
