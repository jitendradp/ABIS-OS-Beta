import {Group, prisma} from "../../generated";
import {Helper} from "../../helper/Helper";

export class StashMutations {
    /**
     * Creates a new StashMutations for (and in the name of) the specified Agent.
     * @param agentId
     * @param name
     * @param logo
     */
    public static async createStash(agentId: string, name: string, logo: string): Promise<Group> {
        const agent = await prisma.agent({id: agentId});
        if (!agent) {
            throw new Error(`Couldn't create a Stash. The specified agentId does not exist: ${agentId}.`);
        }
        const newStash = await prisma.createGroup({
            createdBy: agentId,
            owner: agentId,
            type: "Stash",
            name: name,
            logo: logo,
            isPublic: false,
        });

        Helper.log("Created a new stash (id: " + newStash.id + ").");

        return newStash;
    }
}
