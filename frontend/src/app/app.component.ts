import {Component, Input, ViewChild} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {DataspaceService} from "./services/dataspace.service";
import {AccountService} from "./services/account.service";
import {MatDrawer} from "@angular/material/sidenav";
import {
  ActivationEnd,
  ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterEvent,
  Scroll
} from "@angular/router";
import {IEvent} from "./actions/IEvent";
import {ActionDispatcherService} from "./services/action-dispatcher.service";
import {MatDialog} from "@angular/material";
import {ChannelEditorComponent} from "./editors/channel-editor/channel-editor.component";
import {Home} from "./actions/routes/Home";
import {ShowNotification} from "./actions/ui/ShowNotification";
import {SwitchProfile} from "./actions/routes/SwitchProfile";
import {ToggleVisibility} from "./actions/ui/sidebar/ToggleVisibility";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogEntry} from "./services/logger.service";
import {Back} from "./actions/routes/Back";
import {TeamEditorComponent} from "./editors/team-editor/team-editor.component";

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

  actions: IEvent[] = [];

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
    private _accountService: AccountService,
    private _router: Router,
    private _actionDispatcher: ActionDispatcherService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // Listen to actions ...
    _actionDispatcher.onAction.subscribe(action => this.handleAction(action));
    // Listen to router events ...
    _router.events.subscribe(o => this.handleRouterEvents(o));
  }

  private handleAction(action) {
    switch (action.name) {
      case ToggleVisibility.Name:
        if (action.side == "left") {
          this.left.toggle();
        } else if (action.side == "right") {
          this.right.toggle();
        }
        break;
      case "Abis.Chat.Channel.Create":
        this.openChannelCreateDialog();
        break;
      case "Abis.Chat.Team.Create":
        this.openTeamCreateDialog();
        break;
      case ShowNotification.Name:
        if (action instanceof ShowNotification) {
          if (action.entry instanceof LogEntry) {
            this._snackBar.open(action.entry.source + ": " + action.entry.message, null, {
              duration: 10 * 1000
            });
          } else {
            this._snackBar.open(action.entry, null, {
              duration: 10 * 1000
            });
          }
        }
        break;
      case Home.Name:
        this._router.navigate(["/"]);
        break;
      case Back.Name:
        if (document.referrer == "") {
          this._actionDispatcher.dispatch(new Home());
          return;
        }
        history.back();
        break;
      case SwitchProfile.Name:
        this._router.navigate(["/switch-profile"]);
        break;
    }
  }

  private handleRouterEvents(o: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) {
    // if the event is of Type "ActivationEnd" ...
    if (o instanceof ActivationEnd) {
      // "<Cast>" to the right type to access the "data" property
      const activationEnd = <ActivationEnd>o;
      // set the title on the header bar
      this.title = activationEnd.snapshot.data.title;
      if (activationEnd.snapshot.data.actions) {
        this.actions = activationEnd.snapshot.data.actions;
      } else {
        this.actions = [];
      }
    }
  }

  public openChannelCreateDialog(): void {
    const dialogRef = this._dialog.open(ChannelEditorComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openTeamCreateDialog(): void {
    const dialogRef = this._dialog.open(TeamEditorComponent, {
      width: '50%',
      minWidth: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
