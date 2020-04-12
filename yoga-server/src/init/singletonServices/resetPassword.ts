import {DirectService} from "../../services/directService";
import {Entry, Group, prisma} from "../../generated/prisma_client";
import {Helper} from "../../helper/helper";
import {Mailer} from "../../helper/mailer";

class Implementation extends DirectService {
    private readonly bcrypt = require('bcrypt');

    get welcomeMessageContentEncodingId(): string {
        return this.server.resetPasswordContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const email = newEntry.content.ResetPassword.email;
        var user = await prisma.user({email: email});
        if (!user) {
            Helper.log(`ResetPassword: Couldn't find a user with the email address $[email}.`);
            await this.postContinueTo("", answerChannel.id);
            return;
        }

        // Set a challenge that will be used by the email verification
        user.challenge = Helper.getRandomBase64String(8).toUpperCase();
        await prisma.updateUser({
            where: {id: user.id},
            data: {
                challenge: "#" + user.challenge // TODO: Remove the StartsWith('#') hack. Its used to determine who created the challenge.
            }
        });

        Mailer.sendEmailVerificationCode(user);

        await this.postContinueTo(this.server.verifyEmailServiceId, answerChannel.id);
    }
}

export const Index = {
    name: "ResetPasswordService",
    status: "Running",
    type: "Service",
    serviceDescription: "Sets a new password",
    profileAvatar: "nologo.png",
    implementation: Implementation
};