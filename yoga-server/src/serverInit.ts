import {Agent, ContentEncoding, prisma, User} from "./generated";
import {config} from "./config";
import {ContentEncodings} from "./api/contentEncodings";
import {EventBroker, Topic, Topics} from "./services/EventBroker";
import {NewChannel} from "./services/events/newChannel";
import {Helper} from "./helper/Helper";
import {NewEntry} from "./services/events/newEntry";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";

export class ServerInit {
    public static systemUser:User;
    public static anonymousUser:User;
    public static signupService:Agent;
    public static loginService:Agent;
    public static newChannelTopic:Topic<NewChannel>;
    public static newEntryTopic:Topic<NewEntry>;
    public static signupContentEncoding: ContentEncoding;
    public static verifyEmailContentEncoding: ContentEncoding;
    public static loginContentEncoding: ContentEncoding;

    public async run() {
        await this.createContentEncodings();
        await this.createSystemUser();
        await this.createSignupService();
        await this.createLoginService();
        await this.createAnonymousUser();
        await this.createSystemTopics();
    }

    private async createSystemTopics() {
        ServerInit.newChannelTopic = EventBroker.instance.createTopic<NewChannel>("system", Topics.NewChannel);
        ServerInit.newEntryTopic = EventBroker.instance.createTopic<NewEntry>("system", Topics.NewEntry);

        ServerInit.newChannelTopic.observable.subscribe(newChannel => {
            // Notify the receiving end of the channel (every agent opens uses its own namespace and provides some default topics)
            const newChannelTopic = EventBroker.instance.tryGetTopic<NewChannel>(newChannel.toAgentId, Topics.NewChannel);
            if (newChannelTopic) {
                newChannelTopic.publish(newChannel);
            }
        });

        ServerInit.newEntryTopic.observable.subscribe(async newEntry => {
            // Find everyone who may be concerned by the message and who is allowed to see it
            const subscribers = await FindAgentsThatSeeThis.entry(newEntry.entryId);

            for (let subscriber of subscribers) {
                const newEntryTopic = EventBroker.instance.tryGetTopic<NewEntry>(subscriber, Topics.NewEntry);
                if (newEntryTopic) {
                    newEntryTopic.publish(newEntry);
                }
            }
        });
    }

    private async createSystemUser() {
        ServerInit.systemUser = await prisma.user({email: config.env.systemUser});
        if (ServerInit.systemUser) {
            return;
        }

        Helper.log(`Creating system user`);
        ServerInit.systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    private async createAnonymousUser() {
        ServerInit.anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (ServerInit.anonymousUser) {
            return;
        }

        Helper.log(`Creating anonymous user`);
        ServerInit.anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    private async createSignupService() {
        const signupServices = await prisma.agents({where:{name: "SignupService", type: "Service"}});
        if (signupServices.length > 0) {
            ServerInit.signupService = signupServices[0];
            return;
        }

        Helper.log(`Creating signup service`);
        const signupService = await prisma.createAgent({
            owner: ServerInit.systemUser.id,
            createdBy: ServerInit.systemUser.id,
            name: "SignupService",
            status: "Running",
            type: "Service",
            serviceImplementation: "SignupService",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: ServerInit.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupService.id
                    }
                }
            }
        });

        ServerInit.signupService = signupService;
    }

    private async createLoginService() {
        const loginServices = await prisma.agents({where:{name: "LoginService", type: "Service"}});
        if (loginServices.length > 0) {
            ServerInit.loginService = loginServices[0];
            return;
        }

        Helper.log(`Creating login service`);
        const loginService = await prisma.createAgent({
            owner: ServerInit.systemUser.id,
            createdBy: ServerInit.systemUser.id,
            name: "LoginService",
            status: "Running",
            type: "Service",
            serviceImplementation: "LoginService",
            serviceDescription: "Handles the login requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: ServerInit.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: loginService.id
                    }
                }
            }
        });

        ServerInit.loginService = loginService;
    }

    private async createContentEncodings() {
        const existingSignupContentEncoding = await  prisma.contentEncodings({where:{name:"Signup"}});
        if (existingSignupContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
            ServerInit.signupContentEncoding = await prisma.createContentEncoding(ContentEncodings.Signup);
        } else {
            ServerInit.signupContentEncoding = existingSignupContentEncoding[0];
        }

        const existingVerifyEmailContentEncoding = await  prisma.contentEncodings({where:{name:"VerifyEmail"}});
        if (existingVerifyEmailContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: VerifyEmail/JsonSchema`);
            ServerInit.verifyEmailContentEncoding = await prisma.createContentEncoding(ContentEncodings.VerifyEmail);
        } else {
            ServerInit.verifyEmailContentEncoding = existingSignupContentEncoding[0];
        }

        const existingLoginContentEncoding = await  prisma.contentEncodings({where:{name:"Login"}});
        if (existingLoginContentEncoding.length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Login/JsonSchema`);
            ServerInit.loginContentEncoding = await prisma.createContentEncoding(ContentEncodings.Login);
        } else {
            ServerInit.loginContentEncoding = existingLoginContentEncoding[0];
        }
    }
}
