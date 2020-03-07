import {EventBroker} from "./eventBroker";
import {Service} from "./service";
import {SignupService} from "./signupService";
import {Agent, prisma} from "../generated/prisma_client";
import {LoginService} from "./loginService";
import {Helper} from "../helper/helper";
import {ProfileService} from "./profileService";
import {RoomInboxService} from "./roomInboxService";
import {VerifyEmailService} from "./verifyEmailService";

type ServiceFactory = (eventBroker: EventBroker, agent: Agent) => Service;

const serviceImplementations: { [name: string]: ServiceFactory } = {
    "SignupService": (eventBroker, agent) => new SignupService( eventBroker, agent),
    "VerifyEmailService": (eventBroker, agent) => new VerifyEmailService(eventBroker, agent),
    "LoginService": (eventBroker, agent) => new LoginService( eventBroker, agent),
    "Profile": (eventBroker, agent) => new ProfileService( eventBroker, agent),
    "RoomInbox":  (eventBroker, agent) => new RoomInboxService( eventBroker, agent)
};

export class AgentHost {
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
        const serviceFactory = serviceImplementations[agent.implementation];
        this._services[agent.id] = serviceFactory(this._eventBroker, agent);
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