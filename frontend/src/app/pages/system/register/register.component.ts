import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ClientStateService} from "../../../services/client-state.service";
import {UserService} from "../../../services/user.service";
import {Logger, LoggerService} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {ShowNotification} from "../../../actions/ui/ShowNotification";
import {Back} from "../../../actions/routes/Back";
import {
  ContentEncoding,
  CreateChannelGQL,
  CreateEntryGQL, GetEntriesGQL,
  GetSystemServicesGQL,
  MyChannelsGQL
} from "../../../../generated/abis-api";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  private readonly _log: Logger = this.loggerService.createLogger("RegisterComponent");

  constructor(private _formBuilder: FormBuilder
    , private loggerService: LoggerService
    , private clientState: ClientStateService
    , private userService: UserService
    , private createChannelApi: CreateChannelGQL
    , private createEntryApi: CreateEntryGQL
    , private getEntries: GetEntriesGQL
    , private myChannelsApi: MyChannelsGQL
    , private getSystemAgentsApi: GetSystemServicesGQL
    , private actionDispatcher: ActionDispatcherService) {
  }

  channelId:string;
  contentEncoding:ContentEncoding;

  ngOnInit() {
    // Create a channel
    console.log("Looking for signup channel");
    this.findOrCreateSignupChannel().then(async o => {
      this.channelId = o;

      // Look for forms
      let entries = await this.getEntries.fetch({csrfToken:this.userService.csrfToken, groupId: this.channelId})
        .toPromise();

      let entry = entries.data.getEntries.find(o => o.contentEncoding && o.contentEncoding.name == "Signup");
      if (!entry) {
        throw new Error("Requested entries with contentEncoding.name == 'Signup' but found nothing in the channel.");
      }
      this.contentEncoding = entry.contentEncoding;
      this.formSchema = JSON.parse(entry.contentEncoding.data);
    });
  }

  ngAfterViewInit(): void {
    const f = () => {
      if (this.userService.isLoggedOn) {
        this.actionDispatcher.dispatch(new ShowNotification("You cannot sign up a new user while being logged-on. Log out first and then create a new user. Also try if another profile fits your need."));
        this.actionDispatcher.dispatch(new Back());
        return;
      }
    };
    if (document.referrer == "") {
      setTimeout(f, 500);
    } else {
      f();
    }
  }

  async formSubmit($event: any) {
    console.log("Submitting...");
    const result = this.createEntryApi.mutate({
      csrfToken: this.userService.csrfToken,
      createEntryInput: {
        roomId: this.channelId,
        type:"Json",
        contentEncoding:this.contentEncoding.id,
        content: $event
      }
    }).subscribe(o => {
      console.log("Submitted:", o);
    });
  }

  private async findSignupAgentId(): Promise<string> {
    const systemAgents = await this.getSystemAgentsApi.fetch({csrfToken: this.userService.csrfToken}).toPromise();
    return systemAgents.data.getSystemServices.find(o => o.name == "SignupService").id;
  }

  /**
   * Creates a new Channel to the SignupService-Agent and returns its ID.
   */
  private async findOrCreateSignupChannel(): Promise<string> {
    const signupAgentId = await this.findSignupAgentId();
    const myChannels = await this.myChannelsApi.fetch({csrfToken:this.userService.csrfToken}).toPromise();
    const existingChannel = myChannels.data.myChannels.find(o => o.receiver.id == signupAgentId);
    if (existingChannel) {
      console.log("Found existing signup channel: " + existingChannel.id);
      return existingChannel.id;
    }

    const channel = await this.createChannelApi.mutate({
      csrfToken: this.userService.csrfToken,
      toAgentId: signupAgentId
    }).toPromise();

    console.log("Created a new signup channel: " + channel.data.createChannel.id);

    return channel.data.createChannel.id;
  }

  formSchema: any = {
    "Signup": {
      "type": "object",
      "properties": {
      },
      "required": []
    }
  };
}
