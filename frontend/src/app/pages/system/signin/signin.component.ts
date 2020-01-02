import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../../../services/account.service";

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

  constructor(private _accountService:AccountService) {
  }

  ngOnInit() {
  }

  login() {
    this._accountService.login(this.email.nativeElement.value, this.password.nativeElement.value);
  }
}
