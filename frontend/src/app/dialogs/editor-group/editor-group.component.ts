import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-editor-group',
  templateUrl: './editor-group.component.html',
  styleUrls: ['./editor-group.component.css']
})
export class EditorGroupComponent {

  @Input()
  isPublic: boolean;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  countries = [
    {value: 'de', viewValue: 'Germany'},
    {value: 'us', viewValue: 'United States'},
    {value: 'gb', viewValue: 'Great Britain'}
  ];
}
