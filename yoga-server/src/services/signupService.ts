import {EventBroker} from "./eventBroker";
import {ServerInit} from "../serverInit";
import {Agent, Entry, Group, prisma, User} from "../generated/prisma_client";
import {DirectService} from "./directService";
import {UserOwns} from "../statements/userOwns";
import {Channel} from "../api/types/channel";
import {Helper} from "../helper/helper";
import {ActionResponse} from "../api/mutations/actionResponse";
import {config} from "../config";
import {Mailer} from "../helper/mailer";
import {UserCreate} from "../data/mutations/userCreate";

/**
 * Handles signup requests from anonymous profiles.
 */
export class SignupService extends DirectService {

    constructor(eventBroker:EventBroker, agent:Agent) {
        super(eventBroker, agent);
    }

    get welcomeMessageContentEncodingId(): string {
        return ServerInit.signupContentEncoding.id;
    }

    async onNewChannel(newChannel:Channel) {
        if (!(await UserOwns.profile(ServerInit.anonymousUser.id, newChannel.owner))) {
            throw new Error(`Only anonymous sessions can use this service.`);
        }

        return super.onNewChannel(newChannel);
    }

    async onNewEntry(newEntry:Entry, answerChannel:Group) {
        //
        // Read the user-entry to a typed variable
        //
        const signupEntryContent:{
            first_name:string,
            last_name:string,
            email:string,
            password:string,
            password_confirmation:string
        } = newEntry.content[ServerInit.signupContentEncoding.name];

        // Check if the passwords match
        if (signupEntryContent.password != signupEntryContent.password_confirmation) {
            const validationErrors = [{key: "password", value: "The password and the password confirmation fields do not match."}];
            const summary = "Some of the provided data was invalid. Please correct the data and re-send the form.";
            await this.postError(summary, validationErrors, answerChannel.id);
            return;
        }

        //
        // Try to create a new user with the provided data
        //
        try {
            await SignupService.createUser(signupEntryContent.password, <User>{
                type: "Person",
                email: signupEntryContent.email,
                firstName: signupEntryContent.first_name,
                lastName: signupEntryContent.last_name,
                timezone: "GMT"
            });
        } catch (e) {
            Helper.log(e);
            const validationErrors = [];
            const summary = "Error: The signup process couldn't be completed. Please try again later or contact our support if the problem persists.";
            await this.postError(summary, validationErrors, answerChannel.id);
            return;
        }

        //
        // If all of the above was successful, tell the client to go to the 'VerifyEmail' service.
        //
        await this.postContinueTo(ServerInit.verifyEmailService.id, answerChannel.id);
    }

    private static readonly bcrypt = require('bcrypt');

    private static async createUser(password: string, newUser: User): Promise<ActionResponse> {
        // fact "U.P.1 Alle Benutzer müssen mind. ein Profil besitzen"
        const existingUser = await prisma.user({email: newUser.email});
        if (existingUser) {
            throw new Error(`There is already a registered user (id: ${existingUser.id}) with the same email address: ${newUser.email}`)
        }

        // Hash the password and set it on the newUser from the parameter
        newUser.passwordSalt = await this.bcrypt.genSalt(config.auth.bcryptRounds);
        newUser.passwordHash = await this.bcrypt.hash(password, newUser.passwordSalt);

        // Set a challenge that will be used by the email verification
        newUser.challenge = Helper.getRandomBase64String(8).toUpperCase();

        // Create the user in the database
        let persistentUser = await prisma.createUser(newUser);

        // Set the missing fields on the newUser from the parameter
        newUser.id = persistentUser.id;
        newUser.createdAt = persistentUser.createdAt;

        // Create the first profile and send the e-mail verification code
        await Promise.all([
            this.createFirstProfile(newUser),
            Mailer.sendEmailVerificationCode(newUser)
        ]);

        return <ActionResponse>{
            success: true,
            code: Helper.getRandomBase64String(8)
        };
    }

    /**
     * Creates the first Profile-Agent for the supplied User.
     * @param user
     */
    private static async createFirstProfile(user: User): Promise<Agent> {
        if ((await prisma.user({id:user.id}).agents({where:{type:"Profile"}})).length > 0) {
            throw new Error(`This is not the first Profile of user ${user.id}.`);
        }

        return UserCreate.profile(user.id, user.firstName, "avatar.png", "Available");
    }
}