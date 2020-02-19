import {prisma, User} from "./generated";
import {config} from "./config";
import {ContentEncodings} from "./api/contentEncodings";

export class DatabaseInitialization {
    public systemUser:User;
    public anonymousUser:User;

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

        this.anonymousUser = await prisma.createUser({
            type: "System",
            email: config.env.anonymousUser,
            timezone: "GMT"
        });
    }

    private async createSignupService() {
        const signupService = [await prisma.createAgent({
            owner: this.systemUser.id,
            createdBy: this.systemUser.id,
            name: "SignupService",
            status: "Running",
            type: "Service",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        })];
        await prisma.updateUser({
            where: {
                id: this.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupService[0].id
                    }
                }
            }
        });
    }

    private async createLoginService() {
        const signupService = [await prisma.createAgent({
            owner: this.systemUser.id,
            createdBy: this.systemUser.id,
            name: "LoginService",
            status: "Running",
            type: "Service",
            serviceDescription: "Handles the signup requests of anonymous profiles",
            profileAvatar: "nologo.png"
        })];
        await prisma.updateUser({
            where: {
                id: this.systemUser.id
            },
            data: {
                agents: {
                    connect: {
                        id: signupService[0].id
                    }
                }
            }
        });
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
