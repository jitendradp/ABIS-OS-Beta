import {GraphQLServer} from 'graphql-yoga'
import {prisma} from './generated'
import {ContextParameters} from "graphql-yoga/dist/types";
import {config} from "./config";
import {ServerInit} from "./serverInit";
import {resolvers} from "./resolvers/all";
import {Helper} from "./helper/helper";

const cookie = require('cookie');

const server = new GraphQLServer({
    typeDefs: './src/api/schema.graphql',
    resolvers,
    context: (req: ContextParameters) => {
        return {
            prisma,
            request: req.request,
            response: req.response,
            connection: req.connection,
            bearerToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).bearerToken : null,
            sessionToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).sessionToken : null
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

    Helper.log('Server started.');
});
