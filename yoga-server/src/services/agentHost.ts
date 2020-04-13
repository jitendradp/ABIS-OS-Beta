import {Service} from "./service";
import {Helper} from "../helper/helper";
import {ProfileService} from "./profileService";
import {RoomInboxService} from "./roomInboxService";
import {Init, Server} from "../init";
import {Agent, prisma} from "../generated";

export type ServiceFactory = (server:Server, agent: Agent) => Service;

export class AgentHost {
    serviceImplementations: { [name: string]: ServiceFactory } = {
        "Profile": (server:Server, agent) => new ProfileService(server, agent),
        "RoomInbox":  (server:Server, agent) => new RoomInboxService(server, agent)
    };

    get server() : Server {
        return this._server;
    }
    private _server: Server;

    private _services:{[id:string]:Service} = {};

    constructor(server: Server) {
        this._server = server;
    }

    public loadAgent(agent:Agent) {
        Helper.log(`Starting ${agent.implementation} (${agent.id})`);

        if (this._services[agent.id]) {
            Helper.log(`   ${agent.implementation} (${agent.id}) is already running.`);
            return;
        }

        const serviceFactory = this.serviceImplementations[agent.implementation];
        this._services[agent.id] = serviceFactory(this._server, agent);
        this._services[agent.id].start();
    }

    public async unloadAgent(id:string) {
        const serviceDefinition = await prisma.agent({id:id});
        const serviceInstance = this._services[id];
        if (!serviceDefinition || serviceDefinition.type != "Service" || !serviceInstance) {
            if (serviceDefinition && !serviceInstance) {
                throw new Error(`The service with id '${id}' exists in the database but no instance of it is running in this host.`)
            }
            if (!serviceDefinition && serviceInstance) {
                throw new Error(`The service with id '${id}' has a running instance but doesn't exist in the database.`)
            }
            throw new Error(`A service with the id '${id}' doesn't exist.`);
        }
        Helper.log(`Stopping ${serviceDefinition.implementation} (${id})`);
        this._services[id].stop();
        delete this._services[id];
    }
}