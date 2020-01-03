import {Component, Input, ViewChild} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {DataspaceService} from "./services/dataspace.service";
import {AccountService} from "./services/account.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ActivationEnd, Router} from "@angular/router";
import {IAction} from "./actions/IAction";
import {ActionDispatcherService} from "./services/action-dispatcher.service";
import {MatDialog} from "@angular/material";
import {ChannelEditorComponent} from "./editors/channel-editor/channel-editor.component";
import {Home} from "./actions/routes/Home";
import {ShowNotification} from "./actions/ui/ShowNotification";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("left", {static: true})
  left: MatDrawer;
  @ViewChild("right", {static: true})
  right: MatDrawer;

  @Input()
  isLoggedIn: boolean = true;

  title = 'ABIS';

  public profile = this._profileService.getProfileInformation();
  public dataspace = this._dataspaceService.getDataspaceInformation();
  public account = this._accountService.getAccountInformation();

  actions: IAction[] = [];

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
    private _accountService: AccountService,
    private _router: Router,
    private _actionDispatcher: ActionDispatcherService,
    public _dialog: MatDialog
  ) {
    // Listen to actions ...
    _actionDispatcher.onAction.subscribe(action => {
      switch (action.name) {
        case "Abis.Sidebar.ToggleVisibility":
          this.left.toggle();
          break;
        case "Abis.Chat.ToggleVisibility":
          this.right.toggle();
          break;
        case "Abis.Chat.Channel.Create":
          this.openDialog();
          break;
        case ShowNotification.Name:
          break;
        case Home.Name:
          this._router.navigate(["/"]);
          break;
      }
    });

    // Listen to router events ...
    _router.events.subscribe(o => {
      // if the event is of Type "ActivationEnd" ...
      if (o instanceof ActivationEnd) {
        // "<Cast>" to the right type to access the "data" property
        let activationEnd = <ActivationEnd>o;
        // set the title on the header bar
        this.title = activationEnd.snapshot.data.title;
        if (activationEnd.snapshot.data.actions) {
          this.actions = activationEnd.snapshot.data.actions;
        } else {
          this.actions = [];
        }
      }
    });
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(ChannelEditorComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
