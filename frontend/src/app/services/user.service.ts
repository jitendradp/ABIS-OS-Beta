import {Injectable} from '@angular/core';
import {ActionDispatcherService} from "./action-dispatcher.service";
import {LoginStateChanged} from "../actions/user/LoginStateChanged";
import {
  MyAccountGQL,
  Account,
  UserType,
  ContentEncoding,
  ContentEncodingsGQL,
  MyChannelsGQL,
  GetSystemServicesGQL,
  Service,
  CreateSessionGQL,
  VerifySessionGQL,
  NewEntryGQL,
  NewChannelGQL,
  CreateChannelGQL,
  Channel,
  CreateEntryGQL,
  GetEntriesGQL, Entry, GetEntriesQuery, CreateEntryInput,
} from "../../generated/abis-api";
import {ClientStateService} from "./client-state.service";
import {Logger, LoggerService} from "./logger.service";
import {SessionCreated} from "../actions/user/SessionCreated";
import {ApolloQueryResult} from "apollo-client";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // TODO: Remove the cast to <any> and adopt the UI to the proper UserInformation type.
  // TODO: Remove the "name" field from the graphql schema and replace it with "firstname" and "lastname"
  public accountInformation: Account = {
    id: "8989893943",
    type: <UserType>"Person",
    timezone: "GMT",
    createdAt: new Date().toISOString(),
    email: "tomcook@gmail.com",
    personFirstName: "Thomas",
    personLastName: "Cook",
    personMobilePhone: "01777 78787823"
  };

  private readonly _log: Logger = this.loggerService.createLogger("UserService");

  public get csrfToken(): string {
    return this.clientState.get<string>(this.CsrfTokenKey, null).data;
  }

  private readonly CsrfTokenKey = "UserService.csrfToken";

  public get profileId(): string {
    return this.clientState.get<string>(this.ProfileKey, null).data;
  }

  private readonly ContentEncodingsKey = "UserService.contentEncodings";

  public get contentEncodings(): ContentEncoding[] {
    return this.clientState.get<ContentEncoding[]>(this.ContentEncodingsKey, null).data;
  }

  private readonly SystemServicesKey = "UserService.systemServices";

  public get systemServices(): Service[] {
    return this.clientState.get<Service[]>(this.SystemServicesKey, null).data;
  }

  private readonly ProfileKey = "UserService.profileId";

  public get isLoggedOn(): boolean {
    return this._isLoggedOn;
  }

  private _isLoggedOn: boolean;

  constructor(private actionDispatcher: ActionDispatcherService
    , private createSessionApi: CreateSessionGQL
    , private loggerService: LoggerService
    , private myAccountApi: MyAccountGQL
    , private contentEncodingsApi: ContentEncodingsGQL
    , private clientState: ClientStateService
    , private getSystemServicesApi: GetSystemServicesGQL
    , private myChannelsApi: MyChannelsGQL
    , private verifySessionApi: VerifySessionGQL
    , private newEntrySubscription: NewEntryGQL
    , private newChannelSubscription: NewChannelGQL) {

    // TODO: this seems to be a bit hacky, does the service really need to subscribe to its own events to know that?
    this.actionDispatcher.onAction.subscribe(action => {
      if (action instanceof LoginStateChanged) {
        this._isLoggedOn = action.newValue == 1;
      }
    });
  }

  private async verifySession() {
    const response = await this.verifySessionApi.mutate({csrfToken: this.csrfToken}).toPromise();
    return response.data.verifySession.success;
  }

  public async createAnonymousSession(): Promise<SessionCreated> {
    if (this.systemServices) {
      // If the client settings already exist we assume that there is already a session.
      // If its valid proceed, else clear the client state
      const existingSessionIsValid = await this.verifySession();
      if (!existingSessionIsValid) {
        // If the existing session isn't valid, clear the localStorage and call this method again
        localStorage.clear(); // TODO: Clearing all localStorage is a little radical but good for testing at the moment
        return this.createAnonymousSession();
      } else {
        return new Promise((resolve => resolve(new SessionCreated())));
      }
    }

    const createSessionResponse = await this.createSessionApi.mutate({clientTime: new Date().toISOString()}).toPromise();
    if (!createSessionResponse.data.createSession.success) {
      return;
    }

    this.clientState.set(this.CsrfTokenKey, createSessionResponse.data.createSession.code);

    this.contentEncodingsApi.fetch({csrfToken: createSessionResponse.data.createSession.code})
      .subscribe(contentEncodings => {
        this.clientState.set(this.ContentEncodingsKey, contentEncodings.data.contentEncodings);
      });

    this.getSystemServicesApi.fetch({csrfToken: createSessionResponse.data.createSession.code})
      .subscribe(systemServices => {
        this.clientState.set(this.SystemServicesKey, systemServices.data.getSystemServices);
      });

    this.newEntrySubscription.subscribe({csrfToken: this.csrfToken})
      .subscribe(newEntry => {
        console.log("NEW ENTRY: ", newEntry);
      });

    this.newChannelSubscription.subscribe({csrfToken: this.csrfToken})
      .subscribe(newEntry => {
        console.log("NEW CHANNEL: ", newEntry);
      });
  }

  public async myChannels() {
    let a = await this.myChannelsApi.fetch({csrfToken: this.csrfToken}).toPromise();
    return a.data.myChannels;
  }
}

export class DuplexChannel {

  public fromAgent:string;
  public toAgent:string;

  private _userService:UserService;
  private _createChannelApi: CreateChannelGQL;
  private _createEntryApi: CreateEntryGQL;
  private _getEntriesApi: GetEntriesGQL;

  private _channelId:string;
  private _reverseChannelId:string;

  constructor(userService:UserService
              , createChannelApi: CreateChannelGQL
              , createEntryApi: CreateEntryGQL
              , getEntriesApi: GetEntriesGQL
              , myAgent:string
              , otherAgent:string) {
    this._createChannelApi = createChannelApi;
    this._createEntryApi = createEntryApi;
    this._getEntriesApi = getEntriesApi;
    this._userService = userService;
    this.fromAgent = myAgent;
    this.toAgent = otherAgent;
  }

  public async init() {
    this._channelId = await this.findOrCreateChannel();

     // if no reverse channel exists, wait for one to appear
    if (!this._reverseChannelId) {
      /*
      EventBroker.instance.tryGetTopic(this.fromAgent, Topics.NewChannel).observable
        .subscribe(newChannel => {
          let channel = <Channel>newChannel;
          if (channel.receiver.id == this.fromAgent
            && channel.owner == this.toAgent) {
            // The reverse channel was created
            this._reverseChannelId = channel.id;
          }
        });
       */
    }
  }

  public async read(dateFrom:Date, dateTo:Date) : Promise<Entry[]> {
    const channelEntries = this._getEntriesApi.fetch({
      csrfToken: this._userService.csrfToken,
      from: dateFrom,
      to: dateTo,
      groupId: this._channelId
    }).toPromise();

    const reverseChannelEntries:Promise<ApolloQueryResult<GetEntriesQuery>>  = this._getEntriesApi.fetch({
      csrfToken: this._userService.csrfToken,
      from: dateFrom,
      to: dateTo,
      groupId: this._reverseChannelId
    }).toPromise();

    const results = await Promise.all([channelEntries, reverseChannelEntries]);
    const allResults:any = results.reduce((a:any, b:any) => a.concat(b));

    return <Entry[]>allResults.sort(o => o.createdAt);
  }

  public async write(entry:CreateEntryInput) {
    const newEntry =  await this._createEntryApi.mutate({
      createEntryInput: entry,
      csrfToken: this._userService.csrfToken
    }).toPromise();
  }

  /**
   * Creates a new Channel to the SignupService-Agent and returns its ID.
   */
  private async findOrCreateChannel(): Promise<string> {
    const myChannels = await this._userService.myChannels();
    const existingChannel = myChannels.find(o => o.receiver.id == this.toAgent);
    if (existingChannel) {
      console.log(`Found existing channel "${existingChannel.id}" from "${this.fromAgent}" to "${this.toAgent}".`);
      return existingChannel.id;
    }

    if (existingChannel.reverse) {
      console.log(`Found existing reverse channel "${existingChannel.reverse.id}" from "${this.toAgent}" to "${this.fromAgent}".`)
      this._reverseChannelId = existingChannel.reverse.id;
    }

    const channel = await this._createChannelApi.mutate({
      csrfToken: this._userService.csrfToken,
      toAgentId: this.toAgent
    }).toPromise();

    console.log(`Created a new channel from "${this.fromAgent}" to "${this.toAgent}".`);
    return channel.data.createChannel.id;
  }
}
