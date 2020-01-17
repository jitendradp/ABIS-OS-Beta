import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatHorizontalStepper} from "@angular/material/stepper";
import {ClientStateService} from "../../../services/client-state.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {ProfileType, SignupGQL, VerifyEmailGQL} from "../../../../generated/abis-api";
import {UserService} from "../../../services/user.service";
import {ProfileService} from "../../../services/profile.service";
import {Logger, LoggerService, LogSeverity} from "../../../services/logger.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {Home} from "../../../actions/routes/Home";
import {ShowNotification} from "../../../actions/ui/ShowNotification";
import {Back} from "../../../actions/routes/Back";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild("stepper", {static: true})
  public stepper: MatHorizontalStepper;
  public isLinear = true;
  private readonly _log: Logger = this.loggerService.createLogger("RegisterComponent");

  constructor(private _formBuilder: FormBuilder
    , private loggerService: LoggerService
    , private actionDispatcher: ActionDispatcherService
    , private clientState: ClientStateService
    , private profileService: ProfileService
    , private userService: UserService
    , private signupApi: SignupGQL
    , private verifyEmailApi: VerifyEmailGQL) {
  }

  public step1FormGroup: FormGroup;
  public step1Data: { firstName: string, lastName: string, emailAddress: string, password: string, passwordConfirmation: string };

  public step2FormGroup: FormGroup;
  public step2Data: { code: string };

  public step3FormGroup: FormGroup;
  public step3Data: { name: string, phone: string, slogan: string };

  private _stepperIndex: number;

  ngOnInit() {
    this.step1FormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });

    this.step1FormGroup.valueChanges.subscribe(change => {
      this.step1Data = change;
    });

    this.step2FormGroup = this._formBuilder.group({
      code: ['', Validators.required]
    });

    this.step2FormGroup.valueChanges.subscribe(change => {
      this.step2Data = change;
    });

    this.step3FormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      slogan: ['', Validators.required]
    });

    this.step3FormGroup.valueChanges.subscribe(change => {
      this.step3Data = change;
    });

    // Restore the previously opened page in the stepper or open page '0' as default
    this._stepperIndex = this.clientState.get<number>("RegisterComponent.stepper.selectedIndex", 0).data;
    this.stepper.selectedIndex = this._stepperIndex;
  }

  ngAfterViewInit(): void {
    const f = () => {
      if (this.userService.isLoggedOn) {
        this.actionDispatcher.dispatch(new ShowNotification("You cannot sign up a new account while being logged-on. Log out first and then create a new account. Also try if another profile fits your need."));
        this.actionDispatcher.dispatch(new Back());
        return;
      }
    };
    if (document.referrer == "") {
      setTimeout(f, 500);
    } else {
      f();
    }

    // Disable the previous steps (loaded from clientState) so that the account can't navigate to them again
    this.disableCompletedSteps();
  }

  private disableCompletedSteps(upTp?: number) {
    const steps = this.stepper.steps.toArray();
    for (let i = 0; i < (upTp ? upTp : this.stepper.selectedIndex); i++) {
      const step = steps[i];
      steps[i].completed = true;
      steps[i].editable = false;
    }
  }

  private async submitStep1($event: StepperSelectionEvent) {
    // First step completed, create the account
    await this.signupApi.mutate({
      email: this.step1Data.emailAddress,
      firstName: this.step1Data.firstName,
      lastName: this.step1Data.lastName,
      password: this.step1Data.password
    }).toPromise()
      .then(result => {
        this.clientState.set("RegisterComponent.stepper.selectedIndex", $event.selectedIndex);
        this.disableCompletedSteps($event.selectedIndex);
      })
      .catch(e => {
        this.stepper.selectedIndex = this.clientState.get<number>("RegisterComponent.stepper.selectedIndex", 0).data;
        this._log(LogSeverity.UserNotification, "An error occured during step 1 of the registration wizard (basic sign-up). See the log for detailed error messages.");
        this._log(LogSeverity.Error, e);
      });
  }

  private submitStep2($event: StepperSelectionEvent) {
    // Second step completed, verify the email address
    this.verifyEmailApi.mutate({
      code: this.step2Data.code
    }).toPromise()
      .then(result => {
        // Disable the previous steps so that the account can't navigate to them again
        this.clientState.set("RegisterComponent.stepper.selectedIndex", $event.selectedIndex);
        this.disableCompletedSteps($event.selectedIndex);
        this.userService.setToken(result.data.verifyEmail);
      })
      .catch(e => {
        this.stepper.selectedIndex = this.clientState.get<number>("RegisterComponent.stepper.selectedIndex", 0).data;
        this._log(LogSeverity.UserNotification, "An error occured during step 2 of the registration wizard (verify email address). See the log for detailed error messages.");
        this._log(LogSeverity.Error, e);
      });
  }

  public submitStep3($event: MouseEvent) {
    // Third step completed, create the profile
    // TODO: Pic and Timezone
    // TODO: Only private profiles for now
    this.profileService.createProfile(ProfileType.Private, this.step3Data.name, "pic", "UTC")
      .then(result => {
        if (!result) {
          throw new Error("The profile creation failed unexpectedly.");
        }
        this.userService.setSessionProfile(result)
          .then(r => {
            if (!r) {
              throw new Error("An unexpected error occurred while binding the new profile " + result + " to the session.");
            }
            // Disable the previous steps so that the account can't navigate to them again
            this.clientState.delete("RegisterComponent.stepper.selectedIndex");
            this.disableCompletedSteps(2);

            this.actionDispatcher.dispatch(new Home());
          })
      })
      .catch(e => {
        this.stepper.selectedIndex = this.clientState.get<number>("RegisterComponent.stepper.selectedIndex", 1).data;
        this._log(LogSeverity.UserNotification, "An error occured during step 3 of the registration wizard (create profile). See the log for detailed error messages.");
        this._log(LogSeverity.Error, e);
      });
  }

  public async stepChanged($event: StepperSelectionEvent) {
    if ($event.selectedIndex <= this._stepperIndex) {
      return;
    }
    if ($event.selectedIndex == 1) {
      this.submitStep1($event);
    } else if ($event.selectedIndex == 2) {
      this.submitStep2($event);
    }
  }
}
