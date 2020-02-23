import {GetAgentOf} from "../queries/getAgentOf";
import {EventBroker, Topics} from "../services/eventBroker";
import {Helper} from "../helper/helper";
import {map} from "rxjs/operators";

export const subscriptions = {
    newEntry: {
        subscribe: async (root, {csrfToken}, ctx) => {
            const agentId = await GetAgentOf.session(csrfToken);
            if (!agentId) {
                throw new Error("Couldn't find an agent for this session.");
            }
            const topic = EventBroker.instance.tryGetTopic(agentId, Topics.NewEntry).observable;
            if (!topic) {
                throw new Error("Couldn't find a namespace or topic for the subscribing agent: " + agentId);
            }

            return Helper.observableToAsyncIterable(topic.pipe(map(o => {return {newEntry:o}})));
        },
    }
};