import {GraphQLServer} from 'graphql-yoga'
import {prisma} from './generated'
import {ContextParameters} from "graphql-yoga/dist/types";
import {config} from "./config";
import {ServerInit} from "./serverInit";
import {resolvers} from "./resolvers/all";
import {Helper} from "./helper/helper";
import {Observable} from "rxjs";

const cookie = require('cookie');


const server = new GraphQLServer({
    typeDefs: './src/api/schema.graphql',
    resolvers,
    context: (req: ContextParameters) => {

        // Subscriptions don't have a request and response object
        const isSubscription = !req.request;
        const bearerToken = !isSubscription && req.request.headers.cookie
                ? cookie.parse(req.request.headers.cookie).bearerToken
                : undefined;

        const sessionToken = !isSubscription && req.request.headers.cookie
                ? cookie.parse(req.request.headers.cookie).sessionToken
                : undefined;

        return {
            prisma,
            request: req.request,
            response: req.response,
            connection: req.connection,
            bearerToken: bearerToken,
            sessionToken: sessionToken
        };
    }
});

var morgan = require('morgan');
server.use(morgan('combined'));

server.start({
    cors: {
        methods: ["OPTIONS", "POST"],
        origin: "http://" + config.env.domain + ":4200",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
        optionsSuccessStatus: 200,
        credentials: true
    }
}, async () => {
    Helper.log('Listening on ' + config.env.domain + ":4000");

    await ServerInit.run();

/*
    const obs = new Observable(subscriber => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
    });
    const iterable = Helper.observableToAsyncIterable(obs);

    for await (const item of iterable) {
        console.log("Sucker:", item);
        // 1 2
    }
*/
    Helper.log('Server started.');
});
