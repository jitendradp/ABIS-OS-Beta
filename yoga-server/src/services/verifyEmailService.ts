import {ServerInit} from "../serverInit";
import {Entry, Group, prisma} from "../generated";
import {DirectService} from "./directService";
import {UserQueries} from "../data/queries/user";
import {Helper} from "../helper/helper";

export class VerifyEmailService extends DirectService {
    get welcomeMessageContentEncodingId(): string {
        return ServerInit.verifyEmailContentEncoding.id;
    }

    async onNewEntry(newEntry:Entry, answerChannel:Group){
        const foundUser = await UserQueries.findUserByChallenge(newEntry.content.VerifyEmail.code);
        if (!foundUser) {
            throw new Error(`No challenge with this code could be found.`);
        }

        await VerifyEmailService.clearChallenge(foundUser.id);

        await this.postContinueTo(ServerInit.loginService.id, answerChannel.id);
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