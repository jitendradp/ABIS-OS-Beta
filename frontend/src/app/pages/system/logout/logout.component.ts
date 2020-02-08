import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {Home} from "../../../actions/routes/Home";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private userService:UserService,
              private actionDispatcher:ActionDispatcherService)

  { }

  message:string = "Please wait while we log you out of ABIS ..";

  /*
  private logout() {
    this.userService.logout().then(o => this.actionDispatcher.dispatch(new Home()));
  }*/

  ngOnInit() {
    console.log(document.referrer);
    /*
    if(document.referrer != "") {
      this.logout();
    } else {
      setTimeout(() => {
        this.logout();
      }, 1000);
    }*/
  }

}
