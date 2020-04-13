import {DirectService} from "../../services/directService";
import {UserQueries} from "../../data/queries/user";
import {config} from "../../config";
import {GetAgentOf} from "../../queries/getAgentOf";
import {Entry, Group, prisma} from "../../generated";

class Implementation extends DirectService {
    private readonly bcrypt = require('bcrypt');

    get welcomeMessageContentEncodingId(): string {
        return this.server.setPasswordContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const user = await UserQueries.findUserByChallenge(newEntry.content.SetPassword.code);
        if (!user) {
            throw new Error(`No challenge with this code could be found.`);
        }

        if (newEntry.content.SetPassword.password != newEntry.content.SetPassword.password_confirmation) {
            const validationErrors = [];
            const summary = "Couldn't change the password. The confirmation doesn't match with the new password.";
            this.postError(summary, validationErrors, answerChannel.id);
            return;
        }

        user.passwordSalt = await this.bcrypt.genSalt(config.auth.bcryptRounds);
        user.passwordHash = await this.bcrypt.hash(newEntry.content.SetPassword.password, user.passwordSalt);

        await prisma.updateUser({
            where: {id: user.id},
            data: {
                passwordSalt: user.passwordSalt,
                passwordHash: user.passwordHash
            }
        });

        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const agentId = await GetAgentOf.session(csrfToken, sessionToken);

        await this.postContinueTo(this.server.loginServiceId, answerChannel.id);

        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
    }
}

export const Index = {
    name: "SetPasswordService",
    status: "Running",
    type: "Service",
    serviceDescription: "Sets a new password",
    profileAvatar: "nologo.png",
    implementation: Implementation
};