import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ClientStateService} from "../client-state.service";
import {UserService} from "../user.service";
import {Logger, LoggerService} from "../logger.service";
import {
  ContentEncoding,
  CreateChannelGQL,
  CreateEntryGQL,
  EntryType,
  GetEntriesGQL,
  MyChannelsGQL,
  NewChannelGQL,
  NewEntryGQL
} from "../../../generated/abis-api";
import {Router} from "@angular/router";

/**
 * This component can be used to hold a dialog with a service agent.
 * A dialog typically follows the question->answer pattern:
 * 1) The client starts the dialog by creating a channel to a service.
 * 2) The service creates a reverse channel and puts an empty entry with attached JsonSchema-contentEncoding in it (question).
 * 3) The client interprets the JsonSchema and displays a corresponding form to the user.
 * 4) The user fills-in the form and submits it (answer).
 * 5) The client sends the data from the form together with its original contentEncoding to the service.
 * 6) The service validates the data and either sends:
 * 7.1) A 'Continuation' schema response if the dialog ended successfully - The client should continue the dialog with the next service or end the dialog.
 * 7.2) An 'Error' schema if the sent data was not valid or the processing failed - The user can re-send an edited entry.
 * 7.3) A new schema entry if the dialog with the current service should be continued with a new form.
 */
@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent implements OnInit, OnChanges {
  /**
   * The id of the agent with which the dialog should begin.
   */
  @Input()
  public currentAgentId:string;

  public statusMessage:string = "";
  public statusMessageDetail: { key: string, value: string }[] = [];

  /**
   * The schema of the currently displayed form (default=loading...).
   */
  public formSchema: any = {
    "Loading ...": {
      "type": "object",
      "properties": {},
      "required": []
    }
  };

  private readonly _log: Logger = this.loggerService.createLogger("ServiceDialogComponent");
  private readonly _continuationEncoding:ContentEncoding;
  private readonly _errorEncoding:ContentEncoding;

  /**
   * The channel from the client to the service.
   */
  private _channelId:string;
  /**
   * The channel from the service to the client.
   */
  private _reverseChannelId:string;

  /**
   * The contentEncoding ID that corresponds to the currently set 'formSchema'.
   */
  private formSchemaContentEncodingId: string;

  constructor(private _formBuilder: FormBuilder
    , private loggerService: LoggerService
    , private clientState: ClientStateService
    , private userService: UserService
    , private createChannelApi: CreateChannelGQL
    , private myChannelsApi: MyChannelsGQL
    , private createEntryApi: CreateEntryGQL
    , private getEntries: GetEntriesGQL
    , private newEntrySubscription: NewEntryGQL
    , private newChannelSubscription: NewChannelGQL
    , private router: Router) {
    this._errorEncoding = this.userService.findContentEncodingByName("Error");
    this._continuationEncoding = this.userService.findContentEncodingByName("Continuation");
  }

  /**
   * Restarts the dialog component with the new 'initialAgentId'.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["serviceAgentId"]) {
      return;
    }
    if (!this.currentAgentId) {
      throw new Error("The serviceAgentId property must be set to a value.")
    }
    // noinspection JSIgnoredPromiseFromCall
    this.initChannel();
  }

  ngOnInit() {
    if (!this.currentAgentId) {
      return;
    }
    // noinspection JSIgnoredPromiseFromCall
    this.initChannel();
  }

  /**
   * Sets up the component and establishes the first channel to the 'initialAgentId' if not existing.
   * If the channel as well as the reverse channel already exist, the method proceeds by calling 'initDialog()', else returns.
   */
  private async initChannel() {
    this.subscribeToChannelEvents();

    // Find or create a channel to the specified "serviceAgentId".
    const myChannels = (await this.myChannelsApi.fetch({csrfToken: this.userService.csrfToken}).toPromise()).data.myChannels;
    const myChannel = myChannels.find(o => o.receiver.id == this.currentAgentId);

    if (myChannel && myChannel.reverse) {
      // Duplex channel already established
      this._channelId = myChannel.id;
      this._reverseChannelId = myChannel.reverse.id;
      this.initDialog();
      return;
    }

    if (!myChannel) {
      // No existing channel, create a new one
      const channel = await this.createChannelApi.mutate({
        csrfToken: this.userService.csrfToken,
        toAgentId: this.currentAgentId
      }).toPromise();

      this._channelId = channel.data.createChannel.id;
      return;
    }

    console.log(`Initialized channel ${this._channelId} from '${this.userService.profileId}' to '${this.currentAgentId}'. Waiting for reverse channel ...`);
  }

  /**
   *
   */
  private subscribeToChannelEvents() {
    this.newEntrySubscription.subscribe({csrfToken: this.userService.csrfToken})
      .subscribe((newEntry:any) => {
        if (newEntry.data.newEntry.entry.contentEncoding.id == this._errorEncoding.id) {
          this.statusMessage = newEntry.data.newEntry.entry.content.summary;
        } else if (newEntry.data.newEntry.entry.contentEncoding.id == this._continuationEncoding.id) {
          this.statusMessage = "";

          const continuationContent = newEntry.data.newEntry.entry.content.Continuation;
          this.currentAgentId = continuationContent.toAgentId;

          if (this.currentAgentId.trim() == "") {
            const context = newEntry.data.newEntry.entry.content.Continuation.context;
            if (continuationContent.context && continuationContent.context.csrfToken) {
              // TODO: centralize the csrf-token handling
              this.clientState.set(UserService.CsrfTokenKey, continuationContent.context.csrfToken);
            }
            // A empty agent id means -> navigate to the frontpage (at least for now)
            this.router.navigate(["/"]);
            return;
          }
          // Continue
          this.initChannel();
        }
      });

    this.newChannelSubscription.subscribe({csrfToken: this.userService.csrfToken})
      .subscribe(newEntry => {
        let from = newEntry.data.newChannel.owner;
        let to = newEntry.data.newChannel.receiver.id;

        if (to != this.userService.profileId) {
          throw new Error("Received a notification for another profile.")
        }

        console.log(`Received reverse channel (${newEntry.data.newChannel.id}) from ${from} to ${to}`);
        this._reverseChannelId = newEntry.data.newChannel.id;
        // noinspection JSIgnoredPromiseFromCall
        this.initDialog();
      });
  }

  private async initDialog() {
    const channelState = await this.getChannelState();

    if (channelState.status.success) {
      this.statusMessage = "";
      this.statusMessageDetail = [];
      console.log("Done. Received Continuation.");
      this.currentAgentId = channelState.entries.lastContinuation.content.Continuation.toAgentId;
      this.initChannel();
      return;
    }

    if (channelState.status.error) {
      const lastError = channelState.entries.lastError.content;
      this.statusMessage = lastError.summary;
      this.statusMessageDetail = lastError.detail;
    }

    if (channelState.entries.lastSchema) {
      this.formSchema = JSON.parse(channelState.entries.lastSchema.contentEncoding.data);
      this.formSchemaContentEncodingId = channelState.entries.lastSchema.contentEncoding.id;
      return;
    }

    throw new Error(`Undefined dialog state: Not 'success' and no schema.`);
  }

  async formSubmit($event: any) {
    this.createEntryApi.mutate({
      csrfToken: this.userService.csrfToken,
      createEntryInput: {
        roomId: this._channelId,
        type: EntryType.Json,
        contentEncoding:this.formSchemaContentEncodingId,
        content: $event
      }
    }).subscribe(o => {
      console.log("Submitted:", o);
    });
  }

  /**
   * Makes two requests to the server (to-channel and reverse-Channel) and finds the most recent
   * answer-, schema- and error-entries.
   */
  private async getChannelState() {
    const channelEntries = (await this.getEntries.fetch({
      groupId: this._channelId,
      csrfToken: this.userService.csrfToken
    }).toPromise()).data.getEntries;

    const reverseChannelEntries = (await this.getEntries.fetch({
      groupId: this._reverseChannelId,
      csrfToken: this.userService.csrfToken
    }).toPromise()).data.getEntries;

    const lastPost = channelEntries.length > 0 ? channelEntries[channelEntries.length - 1] : null;
    const lastAnswer = reverseChannelEntries.length > 0 ? reverseChannelEntries[reverseChannelEntries.length - 1] : null;

    const schemaEntries = reverseChannelEntries.filter(o => o.contentEncoding.id && o.type == EntryType.Empty);
    const lastSchema = schemaEntries.length > 0 ? schemaEntries[schemaEntries.length - 1] : null;

    if (lastSchema) {
      lastSchema.contentEncoding = this.userService.findContentEncodingById(lastSchema.contentEncoding.id);
    }

    const errorEntries = reverseChannelEntries.filter(o => o.contentEncoding.id == this._errorEncoding.id);
    const lastError = errorEntries.length > 0 ? errorEntries[errorEntries.length - 1] : null;

    const continuationEntries = reverseChannelEntries.filter(o => o.contentEncoding.id == this._continuationEncoding.id);
    const lastContinuation = continuationEntries.length > 0 ? continuationEntries[continuationEntries.length - 1] : null;

    const success = lastAnswer == lastContinuation;
    const error = lastAnswer == lastError;

    return {
      status: {
        success,
        error
      },
      entries: {
        channelEntries,
        reverseChannelEntries,
        lastPost,
        lastAnswer,
        lastSchema,
        lastError,
        lastContinuation
      }
    };
  }
}
