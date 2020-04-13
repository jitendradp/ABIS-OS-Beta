import {UserCreate} from "../data/mutations/userCreate";
import {UserHas} from "../statements/userHas";
import {GetAgentOf} from "../queries/getAgentOf";
import {AgentCreate} from "../data/mutations/agentCreate";
import {Helper} from "../helper/helper";
import {ActionResponse} from "../api/mutations/actionResponse";
import {Init} from "../init";
import {prisma} from "../generated";
import lowdb = require('lowdb');
import FileSync = require('lowdb/adapters/FileSync');

const uploadDir = './uploads';
const db = new lowdb(new FileSync('db.json'));
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';
import { createWriteStream } from 'fs'
import {AgentCanSee} from "../statements/agentCanSee";

// Seed an empty DB
db.defaults({ uploads: [] }).write();

// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }): Promise<any> => {
    const id = shortid.generate();
    const path = `${uploadDir}/${id}-${filename}`;

    return new Promise((resolve, reject) =>
        stream
            .pipe(createWriteStream(path))
            .on('finish', () => resolve({ id, path }))
            .on('error', reject),
    )
};

const recordFile = file =>
    db
        .get('uploads')
        .push(file)
        .last()
        .write();

const processUpload = async upload => {
    const { createReadStream, filename, mimetype, encoding } = await upload;
    const stream = createReadStream();
    const { id, path } = await storeUpload({ stream, filename });
    return recordFile({ id, filename, mimetype, encoding, path })
};

export const mutations = {

    singleUpload (obj, { file }) {
        processUpload(file);
    },

    multipleUpload (obj, { files }) {
        Promise.all(files.map(processUpload));
    },

    async createSession(root, {clientTime}, ctx) {
        // Every new api user must create a session.
        // The new session, together with a temporary profile, will be created in the context of the "anonymous" system-user.
        // When the user authenticated with the Signup- or LoginService, a new session will be created
        // and sent to the user via his channel to the service.
        const anonymousUserId = Init.anonymousUser.id;
        const anonymousProfile = await UserCreate.profile(
            anonymousUserId,
            `anon_${new Date().getTime()}`,
            "anon.png",
            "Available",
            Init);

        const session = await UserCreate.session(anonymousUserId, anonymousProfile.id, null, clientTime);

        Helper.setSessionTokenCookie(session.sessionToken, ctx.request);
        Helper.clearBearerTokenCookie(ctx.request);

        return <ActionResponse>{
            success: true,
            code: session.csrfToken,
            data: anonymousProfile.id,
            message: "Store the value from the 'code' field in the localStorage and send it with every following request."
        };
    },

    async verifySession(root, {csrfToken}, ctx) {
        if (!ctx.sessionToken) {
            return <ActionResponse>{
                success: false
            };
        }
        const sessions = await prisma.sessions({
            where: {
                csrfToken: csrfToken,
                sessionToken: ctx.sessionToken
            }
        });
        if (sessions.length != 1) {
            return <ActionResponse>{
                success: false
            };
        }
        const session = sessions[0];

        const isValid = session.id
            && session.timedOut == null
            && session.loggedOut == null
            && Date.parse(session.validTo) > Date.now();

        return <ActionResponse>{
            success: isValid
        };
    },

    async createChannel(root, {csrfToken, toAgentId}, ctx) {
        // Every user with a session (and thus a profile) can create a channel to another agent.
        const userHasSession = await UserHas.anonymousSession(ctx.sessionToken, csrfToken);
        if (!userHasSession) {
            throw new Error(`Invalid session`);
        }

        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);
        let newChannel: any;

        // TODO: find a nicer method to determine if a channel should be a memory channel or not
        if (toAgentId == Init.loginServiceId
            || toAgentId == Init.signupServiceId
            || toAgentId == Init.verifyEmailServiceId
            || toAgentId == Init.setPasswordServiceId
            || toAgentId == Init.resetPasswordServiceId) {
            newChannel = await AgentCreate.channel(Init, agentId, toAgentId, true, "New Channel", "channel.png", ctx.sessionToken, csrfToken, ctx.bearerToken);
        } else {
            newChannel = await AgentCreate.channel(Init, agentId, toAgentId, false, "New Channel", "channel.png", ctx.sessionToken, csrfToken, ctx.bearerToken);
        }

        (<any>newChannel).receiver = await prisma.agent({id: toAgentId});

        return newChannel;
    },

    async createEntry(root, {csrfToken, createEntryInput}, ctx) {
        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);
        const groupId = createEntryInput.roomId;

        const newEntryInput = {
            owner: agentId,
            createdBy: agentId,
            name: createEntryInput.name,
            type: createEntryInput.type,
            contentEncoding: createEntryInput.contentEncoding,
            content: createEntryInput.content
        };

        const entry = await AgentCreate.entry(Init, agentId, groupId, newEntryInput, ctx.request, ctx.sessionToken, csrfToken, ctx.bearerToken);
        return entry;
    },

    async deleteChannel(root, {csrfToken, toAgentId}, ctx) {
        throw new Error("Not implemented");
    },

    async updateEntry(root, {csrfToken}, ctx) {
        throw new Error("Not implemented");
    },
    async deleteEntry(root, {csrfToken, entryId}, ctx) {
        throw new Error("Not implemented");
    },

    async addTag(root, {csrfToken, to, addTagInput}, ctx) {
        const agentId = await GetAgentOf.session(csrfToken, ctx.sessionToken);
        const entryId = to;

        if (!(await AgentCanSee.entry(Init, agentId, entryId))) {
            throw new Error(`Entry '${to}' was not found.`);
        }

        const tag = await prisma.createTag({
            createdBy: agentId,
            isPrivate: false,
            type: addTagInput.type,
            value: addTagInput.value,
            owner: agentId
        });

        await prisma.updateEntry({
            where:{id: entryId},
            data:{
                tags: {
                    connect: {
                        id: tag.id
                    }
                }
            }
        });

        return tag;
    },
    async removeTag(root, {csrfToken, tagId}, ctx) {
        throw new Error("Not implemented");
    }
};