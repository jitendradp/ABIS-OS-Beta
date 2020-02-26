import {Observable} from "rxjs";
import {Helper} from "../helper/helper";

export class Topics {
    public static readonly NewChannel = "abis.system.new-channel";
    public static readonly NewEntry = "abis.system.new-entry";
}

export class EventBroker {

    public static get instance() {
        if (!this._instance) {
            this._instance = new EventBroker();
        }
        return this._instance;
    }
    private static  _instance:EventBroker = null;

    private constructor() {
    }

    private _topics:{[namespace:string]: {[name:string]:Topic<any>}} = {};

    /**
     * Creates a new topic and assigns it a unique name.
     * @param namepsace A namespace
     * @param name The unique topic name within the namespace
     */
    public createTopic<T>(namepsace:string, name:string) : Topic<T> {
        if (this._topics[name]){
            throw new Error(`A topic with the name ${name} already exists.`)
        }

        const topic = new Topic<T>(namepsace, name);
        let ns = this._topics[namepsace];
        if (!ns) {
            ns = this._topics[namepsace] = {};
        }
        ns[name] = topic;

        Helper.log(`Created topic '${name}' in namespace '${namepsace}'`);

        return topic;
    }

    /**
     * Gets an existing topic.
     * @param namespace
     * @param name
     */
    public getTopic<T>(namespace:string, name:string) : Topic<T> {
        const ns = this._topics[namespace];
        if (!ns) {
            throw new Error(`There is no namespace with the name '${namespace}'.`)
        }

        const topic = ns[name];
        if (!topic) {
            throw new Error(`There is no topic with the name '${name}' in the namespace '${namespace}'.`)
        }

        return topic;
    }

    public tryGetTopic<T>(namespace:string, name:string) : Topic<T> {
        const ns = this._topics[namespace];
        if (!ns) {
            return null;
        }

        const topic = ns[name];
        if (!topic) {
            return null;
        }

        return topic;
    }

    removeTopic(namespace: string, name: string) {
        throw new Error("Not implemented");
    }
}

export class Topic<T> {
    /**
     * The name of the topic (must be unique within the namespace)
     */
    public get name():string {
        return this._name;
    }
    private _name:string;

    public get namespace():string {
        return this._namespace;
    }
    private _namespace: string;


    /**
     * The event source.
     */
    public get observable():Observable<T> {
        return this._observable;
    }
    private _observable: Observable<T>;

    private _observer:any;

    constructor(namespace:string, name:string) {
        this._namespace = namespace;
        this._name = name;

        this._observable = new Observable<T>(subscriber => {
            this._observer = subscriber;
        });
    }

    /**
     * Publishes a new event to the topic.
     * @param event
     */
    public publish(event:T) {
        // Helper.log(`publishing message to ${this.namespace}.${this.name}: ${JSON.stringify(event)}`);
        this._observer.next(event);
    }
}