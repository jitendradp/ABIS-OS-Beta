import {GraphQLServer} from 'graphql-yoga'
import {prisma} from './generated'
import {ContextParameters} from "graphql-yoga/dist/types";
import {config} from "./config";
import {ServerInit} from "./serverInit";
import {ServiceHost} from "./services/ServiceHost";
import {EventBroker, Topics} from "./services/EventBroker";
import {resolvers} from "./resolvers/all";
import {NewChannel} from "./services/events/newChannel";
import {NewEntry} from "./services/events/newEntry";
import {FindAgentsThatSeeThis} from "./queries/findAgentsThatSeeThis";
import {Helper} from "./helper/Helper";

const cookie = require('cookie');

const serverInit = new ServerInit();
const serviceHost = new ServiceHost(EventBroker.instance);

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
            sessionToken: req.request.headers.cookie ? cookie.parse(req.request.headers.cookie).sessionToken : null,
            serverInit: serverInit
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

    await serverInit.run();


    // Create the signup service
    await serviceHost.loadService(ServerInit.signupService.id);

    // Create the login service
    await serviceHost.loadService(ServerInit.loginService.id);

    Helper.log('Server started.');
});
