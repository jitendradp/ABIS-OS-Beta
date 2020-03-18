import {Init} from "../init";
import {Entry, Group, prisma} from "../generated";
import {DirectService} from "./directService";
import {UserQueries} from "../data/queries/user";
import {Helper} from "../helper/helper";

export class EchoService extends DirectService {
    get welcomeMessageContentEncodingId(): string {
        return Init.echoContentEncoding.id;
    }

    async onNewEntry(newEntry:Entry, answerChannel:Group){
        console.log(newEntry);

        this.postContinueTo(Init.signupService.id, answerChannel.id);

        //this.postError( (parseInt(newEntry.content.Echo.echo) + parseInt(newEntry.content.Echo.test)).toString(), [], answerChannel.id);
    }
}