import {Component, Input, ViewChild} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {DataspaceService} from "./services/dataspace.service";
import {AccountService} from "./services/account.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ActivationEnd, NavigationEnd, Router} from "@angular/router";
import {IAction} from "./IAction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("left", {static: true})
  left:MatDrawer;
  @ViewChild("right", {static: true})
  right:MatDrawer;

  @Input()
  isLoggedIn: boolean = true;

  title = 'myapp';

  public profile = this._profileService.getProfileInformation();
  public dataspace = this._dataspaceService.getDataspaceInformation();
  public account = this._accountService.getAccountInformation();

  actions: IAction[] = null;

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
    private _accountService: AccountService,
    protected _router:Router
  ) {
    let self = this;
    this.actions = [{
      name: "left",
      icon: "menu",
      position: "left",
      action: () => {
        self.left.toggle();
      }
    },{
      name: "right",
      icon: "chat",
      position: "right",
      action: () => {
        self.right.toggle();
      }
    }]
    _router.events.subscribe(o => {
      if (o instanceof ActivationEnd) {
        let activationEnd = <ActivationEnd>o;
        this.title = activationEnd.snapshot.data.title;
      }
    });
  }

  ngOnInit() {
  }
}
