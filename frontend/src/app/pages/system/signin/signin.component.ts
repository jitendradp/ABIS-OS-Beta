import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Logger, LoggerService, LogSeverity} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {Agent, CreateChannelGQL, GetSystemServicesGQL} from "../../../../generated/abis-api";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @ViewChild("email", {static:true})
  email:ElementRef;

  @ViewChild("password", {static:true})
  password:ElementRef;

  private readonly _log:Logger = this.loggerService.createLogger("SigninComponent");

  constructor(private userService:UserService
    , private loggerService:LoggerService
    , private createChannelGQL: CreateChannelGQL
    , private getSystemAgentsApi: GetSystemServicesGQL
    , private actionDispatcher:ActionDispatcherService) {
  }

  private async findSignupAgentId() : Promise<string> {
    const systemAgents = await this.getSystemAgentsApi.fetch({csrfToken: this.userService.csrfToken}).toPromise();
    return systemAgents.data.getSystemServices.find(o => o.name == "SignupService").id;
  }

  /**
   * Creates a new Channel to the SignupService-Agent and returns its ID.
   */
  private async createSignupChannel() : Promise<String> {
    const signupAgentId = await this.findSignupAgentId();
    const channel = await this.createChannelGQL.mutate({
      csrfToken: this.userService.csrfToken,
      toAgentId: signupAgentId
    }).toPromise();

    return channel.data.createChannel.id;
  }

  ngOnInit() {
    // Create a channel
    this.createSignupChannel().then(o => {
      console.log(o);
    });
  }

  /*
  async login() : Promise<void> {
    try {
      const loginResult = await this.userService.login(this.email.nativeElement.value, this.password.nativeElement.value);
      if (!loginResult) {
        return;
      }

      this.actionDispatcherr.dispatch(new Home());

      // const  userProfiles = await this.profileService.listProfiles();
      //
      // if (userProfiles.length == 0) {
      //   this._log(LogSeverity.UserNotification, "You're successfully logged-in, but you don't yet have any profiles. Create a profile to proceed.");
      //   // TODO: redirect the user to a page where he can add a profile
      //   return;
      // }
      //
      // if (userProfiles.length == 1) {
      //   const  result = await this.userService.setSessionProfile(userProfiles[0].id);
      //   if (!result) {
      //     // noinspection ExceptionCaughtLocallyJS
      //     throw new Error("Unexpected error while setting the session profile.")
      //   }
      //   this.actionDispatcherr.dispatch(new Home());
      //   return;
      // }

      // this.actionDispatcherr.dispatch(new SwitchProfile());
    } catch (e) {
      this._log(LogSeverity.UserNotification, "An error occurred during log-on. See the log for detailed error messages.");
      this._log(LogSeverity.Error, e);
      throw e;
    }
  }
  */
}
