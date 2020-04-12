import {DirectService} from "../../services/directService";
import {Entry, Group, prisma} from "../../generated/prisma_client";
import {Helper} from "../../helper/helper";
import {UserQueries} from "../../data/queries/user";

class Implementation extends DirectService {
    get welcomeMessageContentEncodingId(): string {
        return this.server.verifyEmailContentEncoding.id;
    }

    async onNewEntry(newEntry:Entry, answerChannel:Group){
        const foundUser = await UserQueries.findUserByChallenge(newEntry.content.VerifyEmail.code);
        if (!foundUser) {
            throw new Error(`No challenge with this code could be found.`);
        }

        await Implementation.clearChallenge(foundUser.id);

        if (newEntry.content.VerifyEmail.code.startsWith('#')) {
            await this.postContinueTo(this.server.setPasswordServiceId, answerChannel.id);
        } else {
            await this.postContinueTo(this.server.loginServiceId, answerChannel.id);
        }
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