import {GetAgentOf} from "../queries/getAgentOf";
import {EventBroker, Topics} from "../services/eventBroker";
import {Helper} from "../helper/helper";
import {map} from "rxjs/operators";

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
            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newEntry:o}})));
        },
    },
    newChannel: {
        subscribe: async (root, {csrfToken}, ctx) => {
            const topic = await getTopicForAgent(csrfToken, Topics.NewChannel);
            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newChannel:o}})));
        },
    }
};