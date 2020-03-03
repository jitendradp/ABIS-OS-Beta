import {ResponseDelay} from "./responseDelay";
import {config} from "../config";
import {Request} from "express";
import {Observable} from "rxjs";

/**
 * Contains helper methods.
 */
export class Helper {

    public static observableToAsyncIterable<T>(observable:Observable<T>){
        const pullQueue:((T)=>void)[] = [];
        const pushQueue:T[] = [];

        const asyncIterable = {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        // See if there are already some values in the pushQueue
                        const pushedValue = pushQueue.shift();
                        if (pushedValue) {
                            return new Promise<{value:T, done:boolean}>(resolve => resolve({
                                value: pushedValue,
                                done: false
                            }));
                        }

                        // If not, create a new entry in the pull queue and return a promise to it
                        return new Promise<{value:T, done:boolean}>(resolve => {
                            pullQueue.push(resolve);
                        });
                    }
                };
            }
        };

        observable.subscribe(newEntry => {
            // Check if the pull queue contains entries. If yes, handle the queue first
            const pull = pullQueue.shift();
            if (pull) {
                pull({
                    value: newEntry,
                    done: false
                });
                return;
            }

            // If there is currently no pull handler, create an entry in the push queue
            pushQueue.push(newEntry);
        });

        return asyncIterable;
    }

    public static getRandomBase64String(len) {
        let randomNumbers = require("crypto").randomBytes(Math.ceil((len * 3) / 4))
            .toString('base64') // convert to base64 format
            .slice(0, len) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
        return randomNumbers;
    }

    /**
     * Logs a message with a timestamp.
     * @param msg The log-message.
     */
    public static log(msg:string) {
        console.log("[" + new Date().toISOString() + "] " + msg);
    }

    /**
     * Logs a message with a timestamp and a unique id.
     * @param msg The log-message.
     * @returns string The generated id.
     */
    public static logId(msg:string) : string {
        let id = Helper.getRandomBase64String(8);
        Helper.log("[" + new Date().toISOString() + "-ID:" + id + "] " + msg);
        return id;
    }

    public static setBearerTokenCookie(bearerToken: string, request: Request) {
        let contents = {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        };
        request.res.cookie('bearerToken', bearerToken, contents);
    }

    public static setSessionTokenCookie(sessionToken: string, request: Request) {
        let contents = {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        };
        request.res.cookie('sessionToken', sessionToken, contents);
    }

    public static clearBearerTokenCookie(request: Request) {
        let contents = {
            maxAge: 0,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        };
        request.res.cookie('bearerToken', "", contents);
    }

    /**
     * Executes the 'handler' immediately but returns the result not earlier than after
     * the specified delay in milliseconds.
     * @param delayInMs
     * @param handler
     */
    public static async delay<T>(
        delayInMs:number,
        handler: () => T
    ) : Promise<T> {
        const delay = new ResponseDelay(delayInMs);
        const response = handler();
        await delay.GetPromise();
        return response;
    }
}
