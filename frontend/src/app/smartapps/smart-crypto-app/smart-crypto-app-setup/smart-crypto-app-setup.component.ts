import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatHorizontalStepper} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientStateService} from "../../../services/client-state.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";

@Component({
  selector: 'app-smart-crypto-app-setup',
  templateUrl: './smart-crypto-app-setup.component.html',
  styleUrls: ['./smart-crypto-app-setup.component.css']
})
export class SmartCryptoAppSetupComponent implements OnInit, AfterViewInit {


  @ViewChild("stepper", {static: true})
  stepper: MatHorizontalStepper;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private clientState: ClientStateService) {
  }

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

  private disableCompletedSteps(upTp?: number) {
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
