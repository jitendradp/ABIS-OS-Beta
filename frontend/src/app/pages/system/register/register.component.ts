import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatHorizontalStepper} from "@angular/material/stepper";
import {ClientStateService} from "../../../services/client-state.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {DEBUG} from "@angular/compiler-cli/ngcc/src/logging/console_logger";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild("stepper", {static:true})
  stepper:MatHorizontalStepper;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private clientState:ClientStateService) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    // Restore the previously opened page in the stepper or open page '0' as default
    this.stepper.selectedIndex = this.clientState.get<number>("RegisterComponent.stepper.selectedIndex", 0).data;
  }

  stepChanged($event: StepperSelectionEvent) {
    this.clientState.set("RegisterComponent.stepper.selectedIndex", $event.selectedIndex);

    // Disable the previous steps so that the user can't navigate to them again
    this.disableCompletedSteps($event.selectedIndex);
  }

  ngAfterViewInit(): void {
    // Disable the previous steps (loaded from clientState) so that the user can't navigate to them again
    this.disableCompletedSteps();
  }

  private disableCompletedSteps(upTp?:number) {
    let steps = this.stepper.steps.toArray();
    for (let i = 0; i < (upTp ? upTp : this.stepper.selectedIndex); i++) {
      let step = steps[i];
      if (!step) {
        console.log("Empty step");
      }
      steps[i].completed = true;
      steps[i].editable = false;
    }
  }
}
