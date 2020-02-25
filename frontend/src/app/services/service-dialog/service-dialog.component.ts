import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ClientStateService} from "../client-state.service";
import {UserService} from "../user.service";
import {Logger, LoggerService} from "../logger.service";
import {ActionDispatcherService} from "../action-dispatcher.service";
import {
  ContentEncoding,
  CreateChannelGQL,
  CreateEntryGQL,
  EntryType,
  GetEntriesGQL
} from "../../../generated/abis-api";

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent implements OnInit {

  private readonly _log: Logger = this.loggerService.createLogger("RegisterComponent");

  constructor(private _formBuilder: FormBuilder
    , private loggerService: LoggerService
    , private clientState: ClientStateService
    , private userService: UserService
    , private createChannelApi: CreateChannelGQL
    , private createEntryApi: CreateEntryGQL
    , private getEntries: GetEntriesGQL
    , private actionDispatcher: ActionDispatcherService) {
  }

  @Input()
  serviceAgentId:string;

  channelId:string;
  contentEncoding:ContentEncoding;

  ngOnInit() {
    if (!this.serviceAgentId) {
      throw new Error("The serviceAgentId property must be set to a value.")
    }

    this.findOrCreateServiceChannel()
      .then(async channelId => {
        this.channelId = channelId;
        await this.findContentEncoding();
      });
  }

  /**
   * Creates a new Channel to the SignupService-Agent and returns its ID.
   */
  private async findOrCreateServiceChannel(): Promise<string> {
    const myChannels = await this.userService.myChannels();
    const existingChannel = myChannels.find(o => o.receiver.id == this.serviceAgentId);
    if (existingChannel) {
      console.log("Found existing signup channel: " + existingChannel.id);
      return existingChannel.id;
    }

    const channel = await this.createChannelApi.mutate({
      csrfToken: this.userService.csrfToken,
      toAgentId: this.serviceAgentId
    }).toPromise();

    console.log("Created a new signup channel: " + channel.data.createChannel.id);

    return channel.data.createChannel.id;
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
