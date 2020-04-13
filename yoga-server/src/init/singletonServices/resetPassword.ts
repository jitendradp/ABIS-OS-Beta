import {DirectService} from "../../services/directService";
import {Helper} from "../../helper/helper";
import {Mailer} from "../../helper/mailer";
import {GetAgentOf} from "../../queries/getAgentOf";
import {Entry, Group, prisma} from "../../generated";

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

        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const agentId = await GetAgentOf.session(csrfToken, sessionToken);

        await this.postContinueTo(this.server.verifyEmailServiceId, answerChannel.id);
        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
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