import {DirectService} from "../../services/directService";
import {Entry, Group, prisma} from "../../generated/prisma_client";
import {GetUserOf} from "../../queries/getUserOf";
import {config} from "../../config";

class Implementation extends DirectService {
    private readonly bcrypt = require('bcrypt');

    get welcomeMessageContentEncodingId(): string {
        return this.server.changePasswordContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const userId = await GetUserOf.session((<any>newEntry).__csrfToken, (<any>newEntry).__sessionToken);
        const user = await prisma.user({id: userId});

        const passwordsMatch = await this.bcrypt.compare(newEntry.content.ChangePassword.old_password, user.passwordHash);
        if (!passwordsMatch) {
            const validationErrors = [];
            const summary = "Couldn't change the password. The provided 'current password' is invalid.";
            this.postError(summary, validationErrors, answerChannel.id);
            return;
        }
        if (newEntry.content.ChangePassword.password != newEntry.content.ChangePassword.password_confirmation) {
            const validationErrors = [];
            const summary = "Couldn't change the password. The confirmation doesn't match with the new password.";
            this.postError(summary, validationErrors, answerChannel.id);
            return;
        }
        user.passwordSalt = await this.bcrypt.genSalt(config.auth.bcryptRounds);
        user.passwordHash = await this.bcrypt.hash(newEntry.content.ChangePassword.password, user.passwordSalt);

        await prisma.updateUser({
            where: {id: userId},
            data: {
                passwordSalt: user.passwordSalt,
                passwordHash: user.passwordHash
            }
        });

        await this.postContinueTo("", answerChannel.id);
    }
}

export const Index = {
    name: "ChangePasswordService",
    status: "Running",
    type: "Service",
    serviceDescription: "Sets a new password",
    profileAvatar: "nologo.png",
    implementation: Implementation
};