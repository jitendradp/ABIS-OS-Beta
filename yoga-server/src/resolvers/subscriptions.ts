import {GetAgentOf} from "../queries/getAgentOf";
import {EventBroker, Topics} from "../services/eventBroker";
import {Helper} from "../helper/helper";
import {map} from "rxjs/operators";
import {prisma} from "../generated/prisma_client";
import {Observable} from "rxjs";

async function getTopicForAgent(csrfToken:string, topicName:string) {
    const agentId = await GetAgentOf.session(csrfToken);
    if (!agentId) {
        throw new Error("Couldn't find an agent for this session.");
    }
    const topic = EventBroker.instance.tryGetTopic(agentId, topicName).observable;
    if (!topic) {
        throw new Error("Couldn't find a namespace or topic for the subscribing agent: " + agentId);
    }

    return topic;
}

export const subscriptions = {
    newEntry: {
        subscribe: async (root, {csrfToken}, ctx) => {
            const topic = await getTopicForAgent(csrfToken, Topics.NewEntry);

            // TODO: Maybe that works with map() as well (rxjs/promise)?
            const augmentedTopic = new Observable(subscriber => {
                topic.subscribe(async (next:any) => {
                    const containerGroup = (await prisma.groups({
                        where:{
                            entries_some:{
                                id: next.id
                            }
                        }
                    }))[0];
                    subscriber.next({
                        newEntry:{
                            entry: next,
                            containerId: containerGroup.id
                        }
                    });
                });
            });

            return Helper.observableToAsyncIterable(augmentedTopic);
        },
    },
    newChannel: {
        subscribe: async (root, {csrfToken}, ctx) => {
            const topic = await getTopicForAgent(csrfToken, Topics.NewChannel);
            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newChannel:o}})));
        },
    }
};