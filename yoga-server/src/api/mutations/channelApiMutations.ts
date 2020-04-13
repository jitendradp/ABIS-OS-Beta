import {Helper} from "../../helper/helper";
import {ActionResponse} from "./actionResponse";
import {CommonQueries} from "../queries/commonQueries";
import {config} from "../../config";
import {prisma} from "../../generated";

export class ChannelApiMutations {

    static async createChannelInternal(fromAgentId: string, toAgentId: string, isMemory:boolean) {
        try {
            const myAgent = await prisma.agent({id: fromAgentId});
            const otherAgent = await prisma.agent({id: toAgentId});
            const existingChannel = await prisma.groups({
                where: {
                    memberships_some: {member: {id: otherAgent.id}},
                    owner: myAgent.id
                }
            });

            if (existingChannel.length > 0) {
                throw new Error(`There can be only one channel from agent ${myAgent.id} to ${otherAgent.id}.`);
            }

            if (!myAgent || !otherAgent) {
                throw new Error(`The channel between the session's agent and ${toAgentId} cannot be created. Either the originating, the receiving or both agents could not be found.`);
            }

            const newChannelWithMember = await prisma.createGroup({
                type: "Channel",
                createdBy: myAgent.id,
                owner: myAgent.id,
                name: otherAgent.name,
                logo: otherAgent.profileAvatar,
                isPublic: false,
                isMemory: isMemory,
                description: `A direct conversation with ${otherAgent.name}`,
                memberships: {
                    create: {
                        type: "Single",
                        createdBy: myAgent.id,
                        member: {
                            connect: {
                                id: otherAgent.id
                            }
                        },
                        showHistory: true
                    }
                }
            });
            (<any>newChannelWithMember).receiver = otherAgent;
            return newChannelWithMember;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during the creation of a channel: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async createChannel(csrfToken: string, sessionToken: string, bearerToken: string, toAgentId: string) {
        // fact "C.M.1 Ein Channel hat immer genau ein Mitglied"
        // fact "C.M.2 Es gibt keine Channels mit Mitgliedschaften, die nicht vom Channel-Owner erstellt wurden"
        // fact "C.M.3 Es gibt keine zwei Channels mit derselben owner/member-Kombination"
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            return this.createChannelInternal(myAgent.id, toAgentId, false);
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during the creation of a channel: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async deleteChannel(csrfToken: string, sessionToken: string, bearerToken: string, toAgentId: string) {
        return Helper.delay(config.auth.normalizedResponseTime, async () => {
            try {
                const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
                const otherAgent = await prisma.agent({id: toAgentId});
                const channel = await prisma.groups({
                    where: {
                        memberships_some: {id: otherAgent.id},
                        owner: myAgent.id
                    }
                });

                if (channel.length != 1) {
                    throw new Error(`Couldn't find a channel between ${myAgent.id} and ${otherAgent.id} that could be deleted.`);
                }

                const membership = await prisma.group({id: channel[0].id}).memberships();
                if (membership.length != 1) {
                    throw new Error(`Couldn't find a membership in the channel between agents ${myAgent.id} and ${otherAgent.id} that could be deleted.`)
                }

                await prisma.deleteGroup({id: channel[0].id});

                // TODO: Check if the memberships and entries must be deleted separately. Maybe set them to 'cascade' in prisma.
                //await prisma.deleteMembership({id: membership[0].id});

                return <ActionResponse>{
                    success: true,
                    code: Helper.getRandomBase64String(8)
                };
            } catch (e) {
                const errorId = Helper.logId(`An error occurred during the deletion of a channel: ${JSON.stringify(e)}`);
                return <ActionResponse>{
                    success: false,
                    code: errorId
                };
            }
        });
    }
}
