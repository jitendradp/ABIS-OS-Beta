export const subscriptions = {
    newEntry: {
        subscribe: (parent, args, {pubsub}) => {
            return pubsub.asyncIterator('newEntry');
        },
    }
};