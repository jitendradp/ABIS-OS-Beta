import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-editor-room',
  templateUrl: './editor-room.component.html',
  styleUrls: ['./editor-room.component.css']
})
export class EditorRoomComponent {

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
