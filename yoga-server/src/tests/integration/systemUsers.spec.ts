import 'mocha';
import {expect} from 'chai';
import {prisma} from "../../generated";
import {config} from "../../config";
import {UserCreate} from "../../data/mutations/userCreate";
import {mutations} from "../../resolvers/mutations";
import {Init} from "../../init";
import {Topics} from "../../services/eventBroker";

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
    signupReverseChannel: null
};

describe('From anonymous user to signed-up user with authenticated session', () => {
    describe('To sign-up, ..',
        () => {
            before(async () => {
                await Init.run();
            });

            it('.. the "Anonymous" system-user must exist', async () => {
                //await Init.createAnonymousUser();

                context.anonymousUser = await prisma.user({email: config.env.anonymousUser});

                expect(context.anonymousUser)
                    .to.be.not.null;
            });

            it('.. the Signup, Error- and Continuation-ContentEncodings must exist', async () => {
                //await Init.createContentEncodings(context.runtimePath);

                context.signupEncoding = Init.contentEncodingsNameMap["Signup"];
                expect(context.signupEncoding)
                    .not.null.not.undefined;

                context.errorEncoding = Init.contentEncodingsNameMap["Error"];
                expect(context.errorEncoding)
                    .not.null.not.undefined;

                context.continuationEncoding = Init.contentEncodingsNameMap["Continuation"];
                expect(context.continuationEncoding)
                    .not.null.not.undefined;
            });

            it('.. the "System" system-user must exist', async () => {
                //await Init.createSystemUser();

                context.systemUser = await prisma.user({email: config.env.systemUser});

                expect(context.systemUser)
                    .not.null.not.undefined;

                expect(Init.systemUser.id)
                    .not.null.not.undefined;

                expect(Init.systemUser.id)
                    .to.equal(context.systemUser.id);
            });

            it('.. the system topics must exist', async () => {
                //await Init.createSystemTopics();
            });

            it('.. the SignupService must exist', async () => {
                //await Init.createServices(context.runtimePath);
                //await Init.loadAgents();

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

            it('.. the anonymous system-user must create a new anonymous profile', async () => {
                context.anonymousProfile = await UserCreate.profile(
                    context.anonymousUser.id
                    , `anon_${new Date().getTime()}`
                    , "anon.png"
                    , "Available");

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

            it('.. the anonymous session must create a channel to the SignupService', async () => {
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

                return new Promise(async (outerResolve) => {

                    // First we want to be notified about the reverse channell ..
                    await new Promise(async (resolve) => {
                        const eventReceived = Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewChannel).observable.subscribe((event: any) => {

                            // Verify that we got notified about the reverse channel
                            expect(event.owner)
                                .eq(Init.signupServiceId);

                            expect(event.receiver.id)
                                .eq(context.anonymousProfile.id);

                            resolve();
                        });
                    });

                    // .. then about the new Welcome entry
                    await new Promise(async (resolve) => {
                        const eventReceived = Init.eventBroker.getTopic(context.anonymousProfile.id, Topics.NewEntry).observable.subscribe((event: any) => {

                            // Verify that we got a message notification for
                            expect(event.owner)
                                .eq(Init.signupServiceId);

                            expect(event.name)
                                .eq("Welcome");

                            expect(event.contentEncoding.id)
                                .eq(Init.contentEncodingsNameMap["Signup"].id);

                            resolve();
                        });
                    });

                    // If both have been received, resolve the promise
                    outerResolve();
                });
            })
        });
});