import {EventBroker} from "./eventBroker";
import {Agent} from "../generated/prisma_client";

export abstract class Service {
    /*
    Man kann auf zwei Wegen mit einem Service kommunizieren:
    1) Man baut einen Channel zu dem Service auf ("vertraulich")
    2) Man schreibt einen Entry in eine Gruppe in der der Service Mitglied ist
    */
    private _agent: Agent;

    /**
     * If this service has a representation in the db, this fields contains the id.
     */
    public get id():string {
        return this._agent.id;
    }

    /**
     * A human readable name.
     */
    public get name():string {
        return this._agent.name;
    }

    /**
     * Contains the implementation type (a string that identifies a specific service implementation
     * with which the service will be "hydrated" after its loaded from the db)
     */
    public get implementation():string {
        return this._agent.implementation;
    }

    /**
     * The injected EventBroker that is available to every service instance that was created
     * by the AgentHost.
     */
    public get eventBroker():EventBroker {
        return this._eventBroker;
    }
    protected _eventBroker: EventBroker;

    constructor(eventBroker: EventBroker, agent:Agent) {
        this._eventBroker = eventBroker;
        this._agent = agent;
    }

    /**
     * This method should be used create or subscribe to topics.
     */
    abstract start() : void; // TODO: To async or not to async?

    /**
     * This method should be used to remove topics or subscriptions.
     */
    abstract stop() : void; // TODO: To async or not to async?
}