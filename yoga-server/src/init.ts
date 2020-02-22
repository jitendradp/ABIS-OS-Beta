import {Agent, prisma, User} from "./generated";
import {config} from "./config";
import {ContentEncodings} from "./api/contentEncodings";

export class Init {
    public systemUser:User;
    public anonymousUser:User;
    public signupService:Agent;
    public loginService:Agent;

    public async run() {
        await this.createContentEncodings();
        await this.createSystemUser();
        await this.createSignupService();
        await this.createLoginService();
        await this.createAnonymousUser();
    }

    private async createSystemUser() {
        this.systemUser = await prisma.user({email: config.env.systemUser});
        if (this.systemUser) {
            return;
        }

        console.log(`Creating system user`);
        this.systemUser = await prisma.createUser({
            type: "System",
            email: config.env.systemUser,
            timezone: "GMT"
        });
    }

    private async createAnonymousUser() {
        this.anonymousUser = await prisma.user({email: config.env.anonymousUser});
        if (this.systemUser) {
            return;
        }

        console.log(`Creating anonymous user`);
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

        console.log(`Creating signup service`);
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

        console.log(`Creating login service`);
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
            console.log(`Creating instance system ContentEncoding: Signup/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.Signup);
        }
        if ((await  prisma.contentEncodings({where:{name:"VerifyEmail"}})).length == 0) {
            console.log(`Creating instance system ContentEncoding: VerifyEmail/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.VerifyEmail);
        }
        if ((await  prisma.contentEncodings({where:{name:"Login"}})).length == 0) {
            console.log(`Creating instance system ContentEncoding: Login/JsonSchema`);
            await prisma.createContentEncoding(ContentEncodings.Login);
        }
    }
}
