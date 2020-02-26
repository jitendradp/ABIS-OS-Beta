import {AgentCanSee} from "../statements/agentCanSee";
import {prisma} from "../generated";

export class GetEntriesOf {
    /**
     * Gets the entries of the specified channel.
     * @param agentId
     * @param channelId
     */
    public static async channel(agentId: string, channelId: string, from?:Date, to?:Date) {
        if (!await AgentCanSee.channel(agentId, channelId)) {
            throw new Error(`The agent ${agentId} can not see ${channelId}.`);
        }
    }

    /**
     * Get the intertwined entries of the specified channel and its reverse channel.
     * @param agentId
     * @param channelId
     */
    public static async duplexChannel(agentId: string, channelId: string, from?:Date, to?:Date) {
        if (!await AgentCanSee.channel(agentId, channelId)) {
            throw new Error(`The agent ${agentId} can not see ${channelId}.`);
        }

        // Check if the channel actually is a duplex channel (if there is a reverse channel)
        const channel = await prisma.group({id: channelId});
        if (!channel) {
            throw new Error(`The channel ${channelId} doesn't exist.`);
        }

        const channelMembers = await prisma.group({id: channelId}).memberships();
        if (channelMembers.length != 1) {
            throw new Error(`Channel ${channelId} has an invalid number of members (${channelMembers.length}). Channels must always have one member.`)
        }

        const reverseChannel = await prisma.groups({
            where: {
                owner: channelMembers[0].id,
                memberships_every: {
                    member: {
                        id: channel.owner
                    }
                }
            }
        });

        if (reverseChannel.length != 1) {
            throw new Error(`There is no corresponding reverse channel for channel ${channelId}.`);
        }

        const channelContents = await this.channel(agentId, channelId);
        const reverseChannelContents = await this.channel(agentId, reverseChannel[0].id);
    }
}