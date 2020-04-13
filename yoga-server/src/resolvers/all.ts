import {queries} from "./queries";
import {mutations} from "./mutations";
import {subscriptions} from "./subscriptions";

export const resolvers = {
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions,

    // Resolvers for interface types
    Agent: {
        __resolveType: (collection) => {
            return collection.type;
        }
    },
    Group: {
        __resolveType: (collection) => {
            return collection.type;
        }
    },
};