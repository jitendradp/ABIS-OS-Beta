import {EventBroker} from "./eventBroker";
import {Agent} from "../generated/prisma_client";
import {Entry} from "../generated";
import {Init, Server} from "../init";

var SchemaValidator = require('ajv');
var schemaValidator = SchemaValidator({ allErrors: true });
var normalise = require('ajv-error-messages');

export abstract class Service {
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
     * The injected EventBroker.
     */
    public get eventBroker():EventBroker {
        return this._eventBroker;
    }
    protected _eventBroker: EventBroker;

    /**
     * The injected Server environment object.
     */
    public get server():Server {
        return this._server;
    }
    protected _server: Server;

    constructor(server: Server, eventBroker: EventBroker, agent:Agent) {
        this._server = server;
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

    /**
     * Validates an entry against its attached contentType-ID and returns an empty array if no validation errors occurred.
     * Otherwise an array of key-value objects will be returned, where the key is the name of the field and the value is the validation message.
     *
     * Only works for contentTypes of type JsonSchema at the moment.
     * @param newEntry
     */
    protected validateEntry(newEntry: Entry) : {key:string, value:string}[] {
        const contentEncoding = Init.contentEncodings.find(o => o.id == (<any>newEntry.contentEncoding).id);
        if (!contentEncoding) {
            throw new Error(`Entry '${newEntry.id}' doesn't have a 'contentEncoding' value and cannot be validated.`);
        }
        if (contentEncoding.type != "JsonSchema") {
            throw new Error(`Entry '${newEntry.id}' doesn't have a 'contentEncoding' of type 'JsonSchema' and cannot be validated.`);
        }

        const contentEncodingData = JSON.parse(contentEncoding.data);
        const jsonSchema = contentEncodingData[contentEncoding.name];
        const validator = schemaValidator.compile(jsonSchema);
        const isValid = validator(newEntry.content[contentEncoding.name]);

        const normalisedErrors = isValid ? null : normalise(validator.errors);
        if (!normalisedErrors) {
            return [];
        }

        const messageDetails = Object.keys(normalisedErrors.fields).map(key => {
            return {key: key, value: normalisedErrors.fields[key].join("; ")};
        });

        return messageDetails;
    }
}