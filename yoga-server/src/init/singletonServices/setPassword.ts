import {DirectService} from "../../services/directService";
import {Entry, Group, prisma} from "../../generated/prisma_client";
import {UserQueries} from "../../data/queries/user";
import {config} from "../../config";

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

        await this.postContinueTo(this.server.loginServiceId, answerChannel.id);
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