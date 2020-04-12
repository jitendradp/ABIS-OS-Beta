import {GetAgentOf} from "../queries/getAgentOf";
import {EventBroker, Topics} from "../services/eventBroker";
import {Helper} from "../helper/helper";
import {map} from "rxjs/operators";
import {prisma} from "../generated/prisma_client";
import {Observable} from "rxjs";
import {Init, Server} from "../init";

async function getTopicForAgent(server:Server, csrfToken:string, topicName:string) {
    const agentId = await GetAgentOf.session(csrfToken);
    if (!agentId) {
        throw new Error("Couldn't find an agent for this session.");
    }
    const topic = server.eventBroker.tryGetTopic(agentId, topicName).observable;
    if (!topic) {
        throw new Error("Couldn't find a namespace or topic for the subscribing agent: " + agentId);
    }

    return topic;
}

export const subscriptions = {
    newEntry: {
        subscribe: async (root, {csrfToken}, ctx) => {
            if (!csrfToken) {
                throw new Error("Cannot create a subscription without a valid csrfToken");
            }

            const topic = await getTopicForAgent(Init, csrfToken, Topics.NewEntry);

            // TODO: Maybe that works with map() as well (rxjs/promise)?
            const augmentedTopic = new Observable(subscriber => {
                topic.subscribe(async (next:any) => {

                    let containerGroupId = Init.memoryEntries.getGroup(next.id);
                    if (!containerGroupId) {
                        containerGroupId = (await prisma.groups({
                            where: {
                                entries_some: {
                                    id: next.id
                                }
                            }
                        }))[0].id;
                    }
                    subscriber.next({
                        newEntry:{
                            entry: next,
                            containerId: containerGroupId
                        }
                    });
                });
            });

            return Helper.observableToAsyncIterable(augmentedTopic);
        },
    },
    newChannel: {
        subscribe: async (root, {csrfToken}, ctx) => {
            if (!csrfToken) {
                throw new Error("Cannot create a subscription without a valid csrfToken");
            }
            const topic = await getTopicForAgent(Init, csrfToken, Topics.NewChannel);
            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newChannel:o}})));
        },
    },
    newRoom: {
        subscribe: async (root, {csrfToken}, ctx) => {
            if (!csrfToken) {
                throw new Error("Cannot create a subscription without a valid csrfToken");
            }
            const topic = await getTopicForAgent(Init, csrfToken, Topics.NewRoom);
            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newRoom:o}})));
        },
    }
};