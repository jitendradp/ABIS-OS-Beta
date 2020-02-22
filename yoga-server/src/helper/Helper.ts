import {ResponseDelay} from "./ResponseDelay";
import {config} from "../config";
import {Request} from "express";

/**
 * Contains helper methods.
 */
export class Helper {

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
        Helper.log("[" + new Date().toISOString() + "] " + msg);
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
        request.res.cookie('bearerToken', bearerToken, {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    public static setSessionTokenCookie(sessionToken: string, request: Request) {
        request.res.cookie('sessionToken', sessionToken, {
            maxAge: config.auth.sessionTimeout,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
    }

    public static clearBearerTokenCookie(request: Request) {
        request.res.cookie('bearerToken', "", {
            maxAge: 0,
            httpOnly: true, // cookie is only accessible by the server
            domain: config.env.domain,
            secure: process.env.NODE_ENV === 'prod', // only transferred over https
            sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
        });
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
