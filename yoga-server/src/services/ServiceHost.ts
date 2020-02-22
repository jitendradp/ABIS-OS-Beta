import {EventBroker} from "./EventBroker";
import {Service} from "./Service";
import {SignupService} from "./SignupService";
import {Agent, prisma} from "../generated";
import {LoginService} from "./LoginService";
import {Helper} from "../helper/Helper";

type ServiceFactory = (eventBroker: EventBroker, agent: Agent) => Service;

const serviceImplementations: { [name: string]: ServiceFactory } = {
    "SignupService": (eventBroker, agent) => new SignupService( eventBroker, agent),
    "LoginService": (eventBroker, agent) => new LoginService( eventBroker, agent)
};

export class ServiceHost {
    get eventBroker() : EventBroker {
        return this._eventBroker;
    }
    private _eventBroker: EventBroker;

    private _services:{[id:string]:Service} = {};

    constructor(eventBroker:EventBroker) {
        this._eventBroker = eventBroker;
    }

    public async loadService(id:string) {
        const serviceAgent = await prisma.agent({id:id});
        if (!serviceAgent || serviceAgent.type != "Service") {
            throw new Error(`There is no service agent with id '${id}'.`)
        }
        Helper.log(`Starting ${serviceAgent.serviceImplementation} (${id})`);
        const serviceFactory = serviceImplementations[serviceAgent.serviceImplementation];
        this._services[id] = serviceFactory(this._eventBroker, serviceAgent);
        this._services[id].start();
    }

    public async unloadService(id:string) {
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
        Helper.log(`Stopping ${serviceDefinition.serviceImplementation} (${id})`);
        this._services[id].stop();
        delete this._services[id];
    }
}