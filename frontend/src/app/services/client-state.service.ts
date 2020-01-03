import { Injectable } from '@angular/core';
import {tokenReference} from "@angular/compiler";

@Injectable({
  providedIn: 'root'
})
export class ClientStateService {

  public static readonly Version:number = 202001;
  private static readonly Prefix = "Abis.ClientState.";

  constructor() { }

  private _getVersions() : number[] {
    const versions = Object.entries(localStorage)
                           .filter((o:any) => o.toString().startsWith(ClientStateService.Prefix))
                           .map((o:any) => o.toString().substr(ClientStateService.Prefix.length))
                           .map((o:string) => parseInt(o))
                           .sort((a,b) => a == b ? 0 : a > b ? -1 : 1);
    return versions;
  }

  private _getVersion(version:number) : ClientState {
    const json = localStorage.getItem(ClientStateService.Prefix + version);
    if (!json) {
      throw new Error("There is no client state for version " + version);
    }
    return ClientState.parse(json);
  }

  /**
   * Reads a value from the client state.
   * @param key The key
   * @param defaultValue The default value for the case that the key couldn't be founds
   * @return The value or default value together with the client software version trough which it was stored originally.
   */
  public get<T>(key:string, defaultValue:T) : {version:number, data:T} {
    const versions = this._getVersions();
    for (let i = 0; i < versions.length; i++) {
      let version = versions[i];
      let state = this._getVersion(version);
      let data = state.get<T>(key);
      if (data === null) {
        continue;
      }
      return {
        version,
        data
      };
    }
    return {
      version: null,
      data: defaultValue
    }
  }

  /**
   * Stores a value in the client state.
   * @param key The key
   * @param value The value
   */
  public set(key:string, value:any) {
    const versions = this._getVersions();

    let latestState = versions.length > 0 ? this._getVersion(versions[0]) : null;
    if (!latestState || latestState.version <  ClientStateService.Version) {
      latestState = new ClientState();
    }

    latestState.set(key, value);

    const json = JSON.stringify(latestState);
    localStorage.setItem(ClientStateService.Prefix + latestState.version, json);
  }

  /**
   * Deletes a value from the client state (affects all versions)
   * @param key The key
   */
  public delete(key:string) : boolean {
    const versions = this._getVersions();
    let deleted = false;
    for (let i = 0; i < versions.length; i++) {
      let version = versions[i];
      let state = this._getVersion(version);
      if (state.delete(key)) {
        deleted = true;
      }
      const json = JSON.stringify(state);
      localStorage.setItem(ClientStateService.Prefix + state.version, json);
    }

    return deleted;
  }
}

export type ClientStateEntries = {[key:string]:any};

export class ClientState {
  public version:number;
  public entries:ClientStateEntries;

  public static parse(json:string) : ClientState {
    const parsedObj = JSON.parse(json);
    if (!parsedObj.entries) {
      throw new Error("Couldn't find the 'entries' property in the parsed data.");
    }
    return new ClientState(parsedObj.version, parsedObj.entries);
  }

  constructor(version?:number, entries?:ClientStateEntries) {
    this.version = !version ? ClientStateService.Version : version;
    this.entries = !entries ? {} : entries;
  }

  public serialize() : string {
    return JSON.stringify(this);
  }

  public set(key:string, value:any) {
    this.entries[key] = value;
  }

  public get<T>(key:string) : T {
    return this.entries[key];
  }

  public delete(key:string) : boolean {
    const exists:boolean = this.entries[key];
    delete this.entries[key];
    return exists;
  }
}
