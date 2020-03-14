import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateRoomGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

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

  name: string = "";
  description: string = "";

  constructor(private _formBuilder: FormBuilder,
              private createRoomApi:CreateRoomGQL,
              private userService:UserService,
              private actionDispatcher:ActionDispatcherService) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.firstFormGroup.valueChanges.subscribe(change => {
      console.log("firstFormGroup valueChanes:", change);
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.firstFormGroup.valueChanges.subscribe(change => {
      console.log("secondFormGroup valueChanes:", change);
    });
  }

  createRoom() {
    this.createRoomApi.mutate({csrfToken: this.userService.csrfToken, createRoomInput:{
        name: this.firstFormGroup.value.name,
        description: this.firstFormGroup.value.description,
        isPublic: false,
        logo: "room.png"
    }}).toPromise().then(o => {

    }).finally(() => {
      // TODO: Close dialog

    });
  }

  countries = [
    {value: 'de', viewValue: 'Germany'},
    {value: 'us', viewValue: 'United States'},
    {value: 'gb', viewValue: 'Great Britain'}
  ];
}
