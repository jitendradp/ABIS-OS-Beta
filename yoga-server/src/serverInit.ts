import {Agent, prisma, User} from "./generated";
import {config} from "./config";
import {ContentEncodings} from "./api/contentEncodings";
import {EventBroker, Topic, Topics} from "./services/EventBroker";
import {NewChannel} from "./services/events/newChannel";
import {Helper} from "./helper/Helper";
import {NewEntry} from "./services/events/newEntry";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";

export class ServerInit {
    public systemUser:User;
    public anonymousUser:User;
    public signupService:Agent;
    public loginService:Agent;
    public newChannelTopic:Topic<NewChannel>;
    public newEntryTopic:Topic<NewEntry>;

    public async run() {
        await this.createContentEncodings();
        await this.createSystemUser();
        await this.createSignupService();
        await this.createLoginService();
        await this.createAnonymousUser();
        await this.createSystemTopics();
    }

    private async createSystemTopics() {
        this.newChannelTopic = EventBroker.instance.createTopic<NewChannel>("system", Topics.NewChannel);
        this.newEntryTopic = EventBroker.instance.createTopic<NewEntry>("system", Topics.NewEntry);

        this.newChannelTopic.observable.subscribe(newChannel => {
            // Notify the receiving end of the channel (every agent opens uses its own namespace and provides some default topics)
            const newChannelTopic = EventBroker.instance.tryGetTopic<NewChannel>(newChannel.toAgentId, Topics.NewChannel);
            if (newChannelTopic) {
                newChannelTopic.publish(newChannel);
            }
        });

        this.newEntryTopic.observable.subscribe(async newEntry => {
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
        this.systemUser = await prisma.user({email: config.env.systemUser});
        if (this.systemUser) {
            return;
        }

        Helper.log(`Creating system user`);
        this.systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    private async createAnonymousUser() {
        this.anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (this.anonymousUser) {
            return;
        }

        Helper.log(`Creating anonymous user`);
        this.anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    private async createSignupService() {
        const signupServices = await prisma.agents({where:{name: "SignupService", type: "Service"}});
        if (signupServices.length > 0) {
            this.signupService = signupServices[0];
            return;
        }

        Helper.log(`Creating signup service`);
        const signupService = await prisma.createAgent({
            owner: this.systemUser.id,
            createdBy: this.systemUser.id,
            name: "SignupService",
            status: "Running",
            type: "Service",
            serviceImplementation: "SignupService",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: this.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupService.id
                    }
                }
            }
        });

        this.signupService = signupService;
    }

    private async createLoginService() {
        const loginServices = await prisma.agents({where:{name: "LoginService", type: "Service"}});
        if (loginServices.length > 0) {
            this.loginService = loginServices[0];
            return;
        }

        Helper.log(`Creating login service`);
        const loginService = await prisma.createAgent({
            owner: this.systemUser.id,
            createdBy: this.systemUser.id,
            name: "LoginService",
            status: "Running",
            type: "Service",
            serviceImplementation: "LoginService",
            serviceDescription: "Handles the login requests of anonymous profiles",
            profileAvatar: "nologo.png"
        });
        await prisma.updateUser({
            where: {
                id: this.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: loginService.id
                    }
                }
            }
        });

        this.loginService = loginService;
    }

    private async createContentEncodings() {
        if ((await  prisma.contentEncodings({where:{name:"Signup"}})).length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.Signup);
        }
        if ((await  prisma.contentEncodings({where:{name:"VerifyEmail"}})).length == 0) {
            Helper.log(`Creating instance system ContentEncoding: VerifyEmail/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.VerifyEmail);
        }
        if ((await  prisma.contentEncodings({where:{name:"Login"}})).length == 0) {
            Helper.log(`Creating instance system ContentEncoding: Login/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.Login);
        }
    }
}
