import {EntryCreateInput, prisma} from "../../generated";
import {AgentCanPostTo} from "../../statements/agentCanPostTo";
import {EventBroker, Topics} from "../../services/eventBroker";
import {NewChannel} from "../../services/events/newChannel";
import {NewEntry} from "../../services/events/newEntry";

export class AgentPostTo {
    private static async group(agentId: string, groupId: string, entry: EntryCreateInput) {
        entry.createdBy = agentId;
        entry.owner = agentId;

        await prisma.updateGroup({
            where: {
                id: groupId
            },
            data: {
                entries: {
                    create: entry
                }
            }
        });

        // TODO: Stuff like this will fail miserably when executed in parallel. Find a different way to get the inserted ids.
        const newEntry = await prisma.group({id: groupId}).entries({first: 1, orderBy: "createdAt_DESC"});

        EventBroker.instance
            .getTopic<NewEntry>("system", Topics.NewEntry)
            .publish(new NewEntry(agentId, groupId, newEntry[0].id, newEntry[0].contentEncoding));

        return newEntry[0];
    }

    public static async stash(agentId: string, stashId: string, entry: EntryCreateInput) {
        const canPostToStash = AgentCanPostTo.stash(agentId, stashId);
        if (!canPostToStash) {
            throw new Error(`Agent '${agentId}' cannot post to Stash '${stashId}'.`);
        }

        return AgentPostTo.group(agentId, stashId, entry);
    }

    public static async channel(agentId: string, channelId: string, entry: EntryCreateInput) {
        const canPostToChannel = AgentCanPostTo.channel(agentId, channelId);
        if (!canPostToChannel) {
            throw new Error(`Agent '${agentId}' cannot post to Channel '${channelId}'.`);
        }

        return AgentPostTo.group(agentId, channelId, entry);
    }

    public static async room(agentId: string, roomId: string, entry: EntryCreateInput) {
        const canPostToRoom = AgentCanPostTo.room(agentId, roomId);
        if (!canPostToRoom) {
            throw new Error(`Agent '${agentId}' cannot post to Room '${roomId}'.`);
        }

        return AgentPostTo.group(agentId, roomId, entry);
    }
}