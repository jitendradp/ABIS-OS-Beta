import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ClientStateService} from "../client-state.service";
import {UserService} from "../user.service";
import {Logger, LoggerService} from "../logger.service";
import {ActionDispatcherService} from "../action-dispatcher.service";
import {
  Channel,
  ContentEncoding,
  CreateChannelGQL,
  CreateEntryGQL,
  EntryType,
  GetEntriesGQL, GetSystemServicesGQL, MyChannelsGQL, NewChannelGQL, NewEntryGQL, VerifySessionGQL
} from "../../../generated/abis-api";

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent implements OnInit, OnChanges {

  private readonly _log: Logger = this.loggerService.createLogger("RegisterComponent");

  private _channelId:string;
  private _reverseChannelId:string;

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
    , private actionDispatcher: ActionDispatcherService) {
  }

  @Input()
  dialogAgentId:string;

  public get isInitialized() :boolean {
    return this._isInitialized;
  };
  private _isInitialized:boolean = false;

  channelId:string;
  contentEncoding:ContentEncoding;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["serviceAgentId"]) {
      return;
    }
    if (!this.dialogAgentId) {
      throw new Error("The serviceAgentId property must be set to a value.")
    }
    this._isInitialized = false;
    this.initEvents();
    this.init();
  }

  ngOnInit() {
    if (!this.dialogAgentId) {
      return;
    }
    this._isInitialized = false;
    this.initEvents();
    this.init();
  }

  private initEvents() {
    this.newEntrySubscription.subscribe({csrfToken: this.userService.csrfToken})
      .subscribe(newEntry => {
        console.log("NEW ENTRY: ", newEntry);
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
        this._isInitialized = true;
        this.initialized();
      });
  }

  private async init() {
    // Find or create a channel to the specified "serviceAgentId".
    const myChannels = await this.myChannelsApi.fetch({csrfToken: this.userService.csrfToken}).toPromise();
    const myChannel = myChannels.data.myChannels.find(o => o.receiver.id == this.dialogAgentId);

    if (myChannel && myChannel.reverse) {
      // Duplex channel already established
      this._channelId = myChannel.id;
      this._reverseChannelId = myChannel.reverse.id;
      this._isInitialized = true;
      this.initialized();
      return;
    }

    if (!myChannel) {
      // No channel established
      const channel = await this.createChannelApi.mutate({
        csrfToken: this.userService.csrfToken,
        toAgentId: this.dialogAgentId
      }).toPromise();

      this._channelId = channel.data.createChannel.id;
      return;
    }

    console.log(`Initialized channel ${this._channelId} from '${this.userService.profileId}' to '${this.dialogAgentId}'. Waiting for reverse channel ...`);
  }

  private async initialized() {
    const reverseChannelEntries = await this.getEntries.fetch({
      groupId: this._reverseChannelId,
      csrfToken: this.userService.csrfToken
    }).toPromise();
    let sorted = reverseChannelEntries.data.getEntries.sort(o => o.createdAt);
    if (sorted.length == 0) {
      return;
    }
    let last = sorted[sorted.length - 1];
    this.contentEncoding = this.userService.contentEncodings.find(o => o.id == last.contentEncoding.id);
    if (this.contentEncoding) {
      this.formSchema = JSON.parse(this.contentEncoding.data);
    }
  }

  private async findContentEncoding() {
    // Look for schema entries, extract the contentEncoding and create a form from it.
    let entries = await this.getEntries.fetch({
      csrfToken: this.userService.csrfToken,
      groupId: this.channelId
    }).toPromise();

    let schemaEntry = entries.data.getEntries.find(o => o.type == "Empty" && o.contentEncoding);
    if (!schemaEntry) {
      console.log("Requested entries with type == 'Empty' and contentEncoding != null but found nothing in the channel.");
      return;
      //throw new Error("Requested entries with type == 'Empty' and contentEncoding != null but found nothing in the channel.");
    }

    this.contentEncoding = this.userService.contentEncodings.find(o => o.id == schemaEntry.contentEncoding.id);
    this.formSchema = JSON.parse(schemaEntry.contentEncoding.data);
  }

  async formSubmit($event: any) {
    this.createEntryApi.mutate({
      csrfToken: this.userService.csrfToken,
      createEntryInput: {
        roomId: this.channelId,
        type: EntryType.Json,
        contentEncoding:this.contentEncoding.id,
        content: $event
      }
    }).subscribe(o => {
      console.log("Submitted:", o);
    });
  }

  formSchema: any = {
    "Loading ...": {
      "type": "object",
      "properties": {},
      "required": []
    }
  };
}
