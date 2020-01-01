import {Component, Input, ViewChild} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {DataspaceService} from "./services/dataspace.service";
import {AccountService} from "./services/account.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ActivationEnd, NavigationEnd, Router} from "@angular/router";

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

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
    private _accountService: AccountService,
    protected _router:Router
  ) {
    _router.events.subscribe(o => {
      if (o instanceof ActivationEnd) {
        let activationEnd = <ActivationEnd>o;
        this.title = activationEnd.snapshot.data.title;
      }
    });
  }

  ngOnInit() {
  }

  toggle($event: string) {
    if ($event == "left") {
      this.left.toggle();
    }

    if ($event == "chat") {
      this.right.toggle();
    }
  }
}
