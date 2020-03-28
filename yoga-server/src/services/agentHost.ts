import {EventBroker} from "./eventBroker";
import {Service} from "./service";
import {Agent, prisma} from "../generated/prisma_client";
import {Helper} from "../helper/helper";
import {ProfileService} from "./profileService";
import {RoomInboxService} from "./roomInboxService";
import {Init, Server} from "../init";

export type ServiceFactory = (server:Server, eventBroker: EventBroker, agent: Agent) => Service;

export class AgentHost {
    serviceImplementations: { [name: string]: ServiceFactory } = {
        "Profile": (server:Server, eventBroker, agent) => new ProfileService(server,  eventBroker, agent),
        "RoomInbox":  (server:Server, eventBroker, agent) => new RoomInboxService(server,  eventBroker, agent)
    };

    get eventBroker() : EventBroker {
        return this._eventBroker;
    }
    private _eventBroker: EventBroker;

    private _services:{[id:string]:Service} = {};

    constructor(eventBroker:EventBroker) {
        this._eventBroker = eventBroker;
    }

    public loadAgent(agent:Agent) {
        Helper.log(`Starting ${agent.implementation} (${agent.id})`);
        const serviceFactory = this.serviceImplementations[agent.implementation];
        this._services[agent.id] = serviceFactory(Init, this._eventBroker, agent);
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