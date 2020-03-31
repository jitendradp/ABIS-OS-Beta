import 'mocha';
import {expect} from 'chai';
import {prisma} from "../../generated/prisma_client";
import {config} from "../../config";
import {UserCreate} from "../../data/mutations/userCreate";
import {mutations} from "../../resolvers/mutations";
import {Init} from "../../init";
import {Topics} from "../../services/eventBroker";
import {AgentCanSee} from "../../statements/agentCanSee";
import {AgentCreate} from "../../data/mutations/agentCreate";
import {UserOwns} from "../../statements/userOwns";
import {animationFrame} from "rxjs/internal/scheduler/animationFrame";

const context = {
    // Environment
    runtimePath: __dirname + "/../../../dist",

    // To create an anonymous session
    anonymousUser: null,
    anonymousProfile: null,
    session: null,

    // To sign-up
    systemUser: null,
    signupEncoding: null,
    errorEncoding: null,
    continuationEncoding: null,
    signupService: null,
    signupChannel: null,
    signupReverseChannel: null,
    signupWelcomeMessage: null,
    signupContinuation: null,

    verifyEmailService: null,
    verifyEmailEncoding: null,
    verifyEmailChannel: null,
    verifyEmailReverseChannel: null,
    verifyEmailWelcomeMessage: null,
    verifyEmailContinuation: null,

    // To login
    loginEncoding: null,
    loginService: null,
    loginChannel: null,
    loginReverseChannel: null,
    loginWelcomeMessage: null,
    loginContinuation: null
};

describe('From anonymous user to signed-up user with authenticated session', () => {
    describe('To create an anonymous session, ..',
        () => {
            it('.. the "Anonymous" system-user must exist', async () => {
                await Init.createAnonymousUser();

                context.anonymousUser = await prisma.user({email: config.env.anonymousUser});

                expect(context.anonymousUser)
                    .to.be.not.null;
            });

            it('.. the anonymous system-user must create a new anonymous profile', async () => {
                context.anonymousProfile = await UserCreate.profile(
                    context.anonymousUser.id
                    , `anon_${new Date().getTime()}`
                    , "anon.png"
                    , "Available"
                    , Init);

                expect(context.anonymousProfile)
                    .to.be.not.null;

                expect(context.anonymousProfile.owner)
                    .to.equal(context.anonymousUser.id);

                expect(context.anonymousProfile.createdBy)
                    .to.equal(context.anonymousUser.id);
            });

            it('.. the anonymous system-user must create a new session with this profile', async () => {

                context.session = await UserCreate.session(
                    context.anonymousUser.id
                    , context.anonymousProfile.id
                    , null
                    , new Date().toISOString());

                expect(context.session)
                    .to.be.not.null;

                expect(context.session.timedOut)
                    .to.be.null;

                expect(context.session.csrfToken)
                    .to.be.not.null;

                expect(context.session.sessionToken)
                    .to.be.not.null;

                expect(context.session.bearerToken)
                    .to.be.null; // Only authenticated sessions have a bearerToken

                // Check if the session timeout is plausible
                const minValidTo = new Date();
                const maxValidTo = new Date(new Date().getTime() + config.auth.sessionTimeout);
                expect(new Date(context.session.validTo).getTime())
                    .to.be.greaterThan(minValidTo.getTime())
                    .and
                    .to.be.lessThan(maxValidTo.getTime());

                // Check if the session is connected to the right objects
                const sessionAgent = await prisma.session({id: context.session.id}).agent();
                expect(sessionAgent.id)
                    .to.equal(context.anonymousProfile.id);

                const sessionUser = await prisma.session({id: context.session.id}).user();
                expect(sessionUser.id)
                    .to.equal(context.anonymousUser.id);
            });

            it('.. the created session must be valid by the criteria of mutations.verifySession() in the end', async () => {
                const response = await mutations.verifySession(
                    null
                    , {csrfToken: context.session.csrfToken}
                    , {sessionToken: context.session.sessionToken});

                expect(response.success)
                    .to.be.true;
            });
        });

    describe('To sign-up, ..',
        () => {

            it('.. the Signup, VerifyEmail, Error- and Continuation-ContentEncodings must exist', async () => {
                await Init.createContentEncodings(context.runtimePath);

                context.signupEncoding = Init.contentEncodingsNameMap["Signup"];
                expect(context.signupEncoding)
                    .not.null.not.undefined;

                context.errorEncoding = Init.contentEncodingsNameMap["Error"];
                expect(context.errorEncoding)
                    .not.null.not.undefined;

                context.continuationEncoding = Init.contentEncodingsNameMap["Continuation"];
                expect(context.continuationEncoding)
                    .not.null.not.undefined;

                context.verifyEmailEncoding = Init.contentEncodingsNameMap["VerifyEmail"];
                expect(context.continuationEncoding)
                    .not.null.not.undefined;
            });

            it('.. the "System" system-user must exist', async () => {
                await Init.createSystemUser();

                context.systemUser = await prisma.user({email: config.env.systemUser});

                expect(context.systemUser)
                    .not.null.not.undefined;

                expect(Init.systemUser.id)
                    .not.null.not.undefined;

                expect(Init.systemUser.id)
                    .to.equal(context.systemUser.id);
            });

            it('.. the system topics must exist', async () => {
                await Init.createSystemTopics();
            });

            it('.. the SignupService must exist', async () => {
                await Init.createServices(context.runtimePath);
                await Init.loadAgents();

                context.signupService = (await prisma.agents({
                    where: {
                        name: "SignupService",
                        owner: context.systemUser.id
                    }
                }))[0];

                expect(context.signupService)
                    .not.null.not.undefined;

                expect(context.signupService.id)
                    .to.equal(Init.signupServiceId);
            });

            it('.. the VerifyEmailService must exist', async () => {
                await Init.createServices(context.runtimePath);
                await Init.loadAgents();

                context.verifyEmailService = (await prisma.agents({
                    where: {
                        name: "VerifyEmailService",
                        owner: context.systemUser.id
                    }
                }))[0];

                expect(context.verifyEmailService)
                    .not.null.not.undefined;

                expect(context.verifyEmailService.id)
                    .to.equal(Init.verifyEmailServiceId);
            });

            it('.. the anonymous session must establish a duplex channel with the SignupService and wait for the "Welcome" message', async () => {
                const result = await mutations.createChannel(null, {
                    csrfToken: context.session.csrfToken,
                    toAgentId: Init.signupServiceId
                }, {
                    sessionToken: context.session.sessionToken
                });

                expect(result)
                    .not.null.not.undefined;

                expect((<any>result).receiver)
                    .not.null.not.undefined;

                expect((<any>result).receiver.id)
                    .equals(Init.signupServiceId);

                context.signupChannel = result;

                // First we want to be notified about the reverse channel ..
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewChannel).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got notified about the reverse channel
                        expect(event.owner)
                            .eq(Init.signupServiceId);

                        expect(event.receiver.id)
                            .eq(context.anonymousProfile.id);

                        context.signupReverseChannel = event;

                        // Verify that we can access the channel
                        const canSeeChannel = await AgentCanSee.channel(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });

                // .. then about the new Welcome entry
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a message notification for the service's welcome message
                        expect(event.owner)
                            .eq(Init.signupServiceId);

                        expect(event.name)
                            .eq("Welcome");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["Signup"].id);

                        context.signupWelcomeMessage = event;

                        // Verify that we can access the entry
                        const canSeeChannel = await AgentCanSee.entry(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });
            });

            it('.. the anonymous session must fill-in the welcome message and send it back to the SignupService', async () => {
                await AgentCreate.entry(Init, context.anonymousProfile.id, context.signupReverseChannel.id, <any>{
                    contentEncoding: context.signupEncoding.id,
                    type: "Json",
                    content: {
                        Signup: {
                            first_name: "Max",
                            last_name: "Mustermann",
                            email: "max@mustermann.gibtsnicht",
                            password: "12345678",
                            password_confirmation: "12345678"
                        }
                    }
                });

                // We expect the service to answer with a 'Continuation' entry that sends us to the VerifyEmail service
                await new Promise(async (resolve) => {
                    var done = false;
                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a continuation
                        expect(event.owner)
                            .eq(Init.signupServiceId);

                        expect(event.name)
                            .eq("Continuation");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["Continuation"].id);

                        expect(event.content.Continuation.fromAgentId)
                            .eq(Init.signupServiceId);

                        expect(event.content.Continuation.toAgentId)
                            .eq(Init.verifyEmailServiceId);

                        context.signupContinuation = event;

                        resolve();
                    });
                });
            });

            it('.. the anonymous session must establish a duplex channel with the VerifyEmail service and wait for the "Welcome" message.', async () => {
                const result = await mutations.createChannel(null, {
                    csrfToken: context.session.csrfToken,
                    toAgentId: Init.verifyEmailServiceId
                }, {
                    sessionToken: context.session.sessionToken
                });

                expect(result)
                    .not.null.not.undefined;

                expect((<any>result).receiver)
                    .not.null.not.undefined;

                expect((<any>result).receiver.id)
                    .equals(Init.verifyEmailServiceId);

                context.verifyEmailChannel = result;

                // First we want to be notified about the reverse channel ..
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewChannel).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got notified about the reverse channel
                        expect(event.owner)
                            .eq(Init.verifyEmailServiceId);

                        expect(event.receiver.id)
                            .eq(context.anonymousProfile.id);

                        context.verifyEmailReverseChannel = event;

                        // Verify that we can access the channel
                        const canSeeChannel = await AgentCanSee.channel(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });

                // .. then about the new Welcome entry
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a message notification for the service's welcome message
                        expect(event.owner)
                            .eq(Init.verifyEmailServiceId);

                        expect(event.name)
                            .eq("Welcome");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["VerifyEmail"].id);

                        context.verifyEmailWelcomeMessage = event;

                        // Verify that we can access the entry
                        const canSeeChannel = await AgentCanSee.entry(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });
            });

            it('.. the anonymous session must fill-in the welcome message and send it back to the VerifyEmail service', async () => {
                const usersWithChallenge = await prisma.users({where: {challenge_not: null}});
                const profileOwner = usersWithChallenge.filter(async o => await UserOwns.profile(o.id, context.anonymousProfile.id));

                expect(profileOwner.length)
                    .eq(1);

                await AgentCreate.entry(Init, context.anonymousProfile.id, context.verifyEmailReverseChannel.id, <any>{
                    contentEncoding: context.verifyEmailEncoding.id,
                    type: "Json",
                    content: {
                        VerifyEmail: {
                            code: profileOwner[0].challenge
                        }
                    }
                });

                // We expect the service to answer with a 'Continuation' entry that sends us to the Login service
                await new Promise(async (resolve) => {
                    var done = false;
                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a continuation
                        expect(event.owner)
                            .eq(Init.verifyEmailServiceId);

                        expect(event.name)
                            .eq("Continuation");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["Continuation"].id);

                        expect(event.content.Continuation.fromAgentId)
                            .eq(Init.verifyEmailServiceId);

                        expect(event.content.Continuation.toAgentId)
                            .eq(Init.loginServiceId);

                        context.verifyEmailContinuation = event;

                        resolve();
                    });
                });
            });
        });

    describe('To log in, ..',
        () => {

            it('.. the Login, Error- and Continuation-ContentEncodings must exist', async () => {
                await Init.createContentEncodings(context.runtimePath);

                context.loginEncoding = Init.contentEncodingsNameMap["Login"];
                expect(context.loginEncoding)
                    .not.null.not.undefined;

                context.errorEncoding = Init.contentEncodingsNameMap["Error"];
                expect(context.errorEncoding)
                    .not.null.not.undefined;

                context.continuationEncoding = Init.contentEncodingsNameMap["Continuation"];
                expect(context.continuationEncoding)
                    .not.null.not.undefined;
            });

            it('.. the LoginService must exist', async () => {
                await Init.createServices(context.runtimePath);
                await Init.loadAgents();

                context.loginService = (await prisma.agents({
                    where: {
                        name: "LoginService",
                        owner: context.systemUser.id
                    }
                }))[0];

                expect(context.loginService)
                    .not.null.not.undefined;

                expect(context.loginService.id)
                    .to.equal(Init.loginServiceId);
            });

            it('.. the anonymous session must establish a duplex channel with the LoginService and wait for the "Welcome" message', async () => {
                const result = await mutations.createChannel(null, {
                    csrfToken: context.session.csrfToken,
                    toAgentId: Init.loginServiceId
                }, {
                    sessionToken: context.session.sessionToken
                });

                expect(result)
                    .not.null.not.undefined;

                expect((<any>result).receiver)
                    .not.null.not.undefined;

                expect((<any>result).receiver.id)
                    .equals(Init.loginServiceId);

                context.loginChannel = result;

                // First we want to be notified about the reverse channel ..
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewChannel).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got notified about the reverse channel
                        expect(event.owner)
                            .eq(Init.loginServiceId);

                        expect(event.receiver.id)
                            .eq(context.anonymousProfile.id);

                        context.loginReverseChannel = event;

                        // Verify that we can access the channel
                        const canSeeChannel = await AgentCanSee.channel(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });

                // .. then about the new Welcome entry
                await new Promise(async (resolve) => {
                    var done = false;

                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a message notification for the service's welcome message
                        expect(event.owner)
                            .eq(Init.loginServiceId);

                        expect(event.name)
                            .eq("Welcome");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["Login"].id);

                        context.loginWelcomeMessage = event;

                        // Verify that we can access the entry
                        const canSeeChannel = await AgentCanSee.entry(context.anonymousProfile.id, event.id);
                        expect(canSeeChannel)
                            .to.be.true;

                        resolve();
                    });
                });
            });

            it('.. the anonymous session must fill-in the welcome message and send it back to the LoginService', async () => {
                await AgentCreate.entry(Init, context.anonymousProfile.id, context.loginReverseChannel.id, <any>{
                    contentEncoding: context.loginEncoding.id,
                    type: "Json",
                    content: {
                        Login: {
                            email: "max@mustermann.gibtsnicht",
                            password: "12345678"
                        }
                    }
                });

                // We expect the service to answer with a 'Continuation' entry that sends us to the VerifyEmail service
                await new Promise(async (resolve) => {
                    var done = false;
                    Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe(async (event: any) => {

                        if (done) {
                            return;
                        }
                        done = true;

                        // Verify that we got a continuation
                        expect(event.owner)
                            .eq(Init.loginServiceId);

                        expect(event.name)
                            .eq("Continuation");

                        expect(event.contentEncoding.id)
                            .eq(Init.contentEncodingsNameMap["Continuation"].id);

                        expect(event.content.Continuation.fromAgentId)
                            .eq(Init.loginServiceId);

                        expect(event.content.Continuation.toAgentId)
                            .eq(undefined);

                        context.loginContinuation = event;

                        resolve();
                    });
                });
            });
        });
});