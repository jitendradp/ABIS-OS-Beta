import {
  ContentEncoding,
  getSdk
} from "./generated/abis-api";
import {GraphQLClient} from "graphql-request";
import {BehaviorSubject} from "rxjs";

export class AbisSession {
  /**
   * Must be used to determine if a session is fully initialized and usable.
   */
  public get loadedStatus() {
    return this._loadedStatusSubject;
  }

  private _loadedStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get csrfToken() {
    return this._csrfTokenSubject;
  };

  private _csrfTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public get profileId() {
    return this._profileIdSubject;
  };

  private _profileIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public get ContentEncodings() {
    return this._contentEncodingsSubject;
  }

  private _contentEncodingsSubject: BehaviorSubject<ContentEncoding[]> = new BehaviorSubject<ContentEncoding[]>([]);

  public get SystemServices() {
    return this._systemServicesSubject;
  }

  private _systemServicesSubject: BehaviorSubject<{ id: string, name: string }[]> = new BehaviorSubject<{ id: string, name: string }[]>([]);

  public get url() {
    return this._url;
  }

  private _url: string;

  private _api: any;
  private _sessionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(url: string) {
    this._url = url;
    this._api = getSdk(new GraphQLClient(this.url));

    // Self-subscribe to the session status and call "onSessionAvailable" when a session becomes available
    this._sessionStatusSubject.subscribe(status => {
      if (!status) {
        this.onSessionNotAvailable();
      } else {
        this.onSessionAvailable();
      }
    });

    // Check if there is an existing session or create a new one
    this.ensureSession();
  }

  private onSessionNotAvailable() {
    this._loadedStatusSubject.next(false);
    this._contentEncodingsSubject.next([]);
    this._contentEncodingsSubject.next([]);
    this._csrfTokenSubject.next(null);
    this._profileIdSubject.next(null);
  }

  private onSessionAvailable() {
    const operations = [
      this.loadSystemServices(),
      this.loadContentEncodings()
    ];
    Promise.all(operations)
      .then(results => {
        const allSuccess = results.reduce((p, c) => p && c, true);
        if (!allSuccess) {
          throw new Error(`Couldn't load all of the necessary initial data from the server.`);
        }
        this.onLoaded();
      });
  }

  private onLoaded() {
    this._loadedStatusSubject.next(true);
  }

  private loadContentEncodings() {
    return this._api.contentEncodings({csrfToken: this.csrfToken.getValue()})
      .then(contentEncodings => {
        const encodings = contentEncodings.contentEncodings.map((o: any) => {
          o.createdBy = "";
          o.createdAt = "";
          return o;
        });
        this._contentEncodingsSubject.next(encodings);
        return true;
      });
  }

  private loadSystemServices() {
    return this._api.getSystemServices({csrfToken: this.csrfToken.getValue()})
      .then(systemServices => {
        this._systemServicesSubject.next(systemServices.getSystemServices);
        return true;
      });
  }

  private ensureSession() {
    let sessionPromise;

    if (!this.csrfToken.getValue()) {
      // When we don't have a token, we create a new session straight away
      sessionPromise = this.createSession();
    } else {
      // If we have a token, we try to verify it and only create a new session if its invalid
      sessionPromise = this.verifySession()
        .then(result => !result ? this.createSession() : Promise.resolve())
        .catch(error => {
          console.log(`Cannot load the application: ${error}`)
        });
    }

    sessionPromise
      .then(o => this._sessionStatusSubject.next(true))
      .catch(e => this._sessionStatusSubject.next(false));
  }

  private async verifySession() {
    const result = await this._api.verifySession({
      csrfToken: this.csrfToken.getValue()
    });
    return result.verifySession.success;
  };

  private async createSession() {
    const session = await this._api.createSession({
      clientTime: new Date().toISOString()
    });
    if (!session.createSession.success) {
      throw new Error(`Cannot create a new anonymous session at ${this.url}.`);
    }
    this._csrfTokenSubject.next(session.createSession.code);
    this._profileIdSubject.next(session.createSession.data);
  };
}