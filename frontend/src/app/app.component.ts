import {Component, Input, ViewChild} from '@angular/core';
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
import {EditorChannelComponent} from "./dialogs/editor-channel/editor-channel.component";
import {Home} from "./actions/routes/Home";
import {ShowNotification} from "./actions/ui/ShowNotification";
import {SwitchProfile} from "./actions/routes/SwitchProfile";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogEntry} from "./services/logger.service";
import {Back} from "./actions/routes/Back";
import {EditorGroupComponent} from "./dialogs/editor-group/editor-group.component";
import {SetVisibility} from "./actions/ui/sidebar/SetVisibility";
import {DeviceDetectorService} from "ngx-device-detector";
import {RouteChanged} from "./actions/routes/RouteChanged";
import {ListGroupComponent} from "./lists/list-group/list-group.component";
import {InviteComponent} from "./widgets/chat/invite/invite.component";
import {Logout} from "./actions/routes/Logout";

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

  actions: IEvent[] = [];

  constructor(
    private _router: Router,
    private _actionDispatcher: ActionDispatcherService,
    public _dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private _snackBar: MatSnackBar
  ) {
    // Listen to actions ...
    _actionDispatcher.onAction.subscribe(action => this.handleAction(action));
    // Listen to router events ...
    _router.events.subscribe(o => this.handleRouterEvents(o));
  }

  private handleAction(action) {
    switch (action.name) {
      case RouteChanged.Name:
        // set the title on the header bar
        this.title = action.data.title;
        if (action.data.actions) {
          this.actions = action.data.actions;
        } else {
          this.actions = [];
        }

        if (this.deviceService.isMobile() && this.right.opened) {
          this._actionDispatcher.dispatch(new SetVisibility("right", "invisible"));
        }
        break;
      case SetVisibility.Name:
        let visibility: boolean = false;
        switch (action.state) {
          case "visible":
            visibility = true;
            break;
          case "invisible":
            visibility = false;
            break;
          default:
            visibility = undefined;
            break;
        }
        if (action.side == "left") {
          this.left.toggle(visibility);
        } else if (action.side == "right") {
          this.right.toggle(visibility);
        }
        break;
      case "Abis.Chat.Channel.Create":
        this.openChannelCreateDialog();
        break;
      case "Abis.Chat.Group.Create":
        this.openGroupCreateDialog();
        break;
      case "Abis.Chat.Contact.Invite":
        this.openContactInviteDialog();
        break;
      case "Abis.Chat.Group.Explore":
        this.openGroupExploreDialog();
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
      case Logout.Name:
        this._router.navigate(["/logout"]);
        break;
    }
  }

  private handleRouterEvents(o: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) {
    // if the event is of Type "ActivationEnd" ...
    if (o instanceof ActivationEnd) {
      this._actionDispatcher.dispatch(new RouteChanged(o.snapshot.data));
    }
  }

  public openChannelCreateDialog(): void {
    const dialogRef = this._dialog.open(EditorChannelComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openGroupCreateDialog(): void {
    const dialogRef = this._dialog.open(EditorGroupComponent, {
      width: '30%',
      minWidth: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openGroupExploreDialog(): void {
    const dialogRef = this._dialog.open(ListGroupComponent, {
      width: '50%',
      minWidth: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openContactInviteDialog(): void {
    const dialogRef = this._dialog.open(InviteComponent, {
      width: '50%',
      minWidth: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
