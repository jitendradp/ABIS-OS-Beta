import {DirectService} from "../../services/directService";
import {Helper} from "../../helper/helper";
import {UserQueries} from "../../data/queries/user";
import {Entry, Group, prisma} from "../../generated";
import {GetAgentOf} from "../../queries/getAgentOf";

class Implementation extends DirectService {
    get welcomeMessageContentEncodingId(): string {
        return this.server.verifyEmailContentEncoding.id;
    }

    async onNewEntry(newEntry: Entry, answerChannel: Group) {
        const foundUser = await UserQueries.findUserByChallenge(newEntry.content.VerifyEmail.code);
        if (!foundUser) {
            throw new Error(`No challenge with this code could be found.`);
        }

        await Implementation.clearChallenge(foundUser.id);
        await this.postContinueTo(this.server.loginServiceId, answerChannel.id);

        const csrfToken = (<any>newEntry).__csrfToken;
        const sessionToken = (<any>newEntry).__sessionToken;
        const agentId = await GetAgentOf.session(csrfToken, sessionToken);
        /*
        await prisma.deleteManyGroups({owner:this.id, type:"Channel", memberships_every:{member:{id:agentId}}});
        await prisma.deleteManyGroups({owner:agentId, type:"Channel", memberships_every:{member:{id:this.id}}});
         */
    }

    private static async clearChallenge(userId: string) {
        await prisma.updateUser({
            data: {
                challenge: null
            },
            where: {
                id: userId
            }
        });

        Helper.log(`Cleared the challenge for user ${userId}.`);
    }
}

export const Index = {
    name: "VerifyEmailService",
    status: "Running",
    type: "Service",
    serviceDescription: "Handles the login requests of anonymous profiles",
    profileAvatar: "nologo.png",
    implementation: Implementation
};