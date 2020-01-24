import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isLinear = false;
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.step1FormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.step2FormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.step3FormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
