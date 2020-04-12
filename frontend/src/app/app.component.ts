import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
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
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogEntry} from "./services/logger.service";
import {Back} from "./actions/routes/Back";
import {EditorGroupComponent} from "./dialogs/editor-group/editor-group.component";
import {SetSidebarVisibility} from "./actions/ui/SetSidebarVisibility";
import {DeviceDetectorService} from "ngx-device-detector";
import {RouteChanged} from "./actions/routes/RouteChanged";
import {ListGroupComponent} from "./list-items/list-group/list-group.component";
import {Logout} from "./actions/routes/Logout";
import {UserService} from "./services/user.service";
import {CreateEntryGQL} from "../generated/abis-api";
import {NestedAction} from "./actions/NestedAction";
import {SetApplicationTitle} from "./actions/ui/SetApplicationTitle";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild("left", {static: false})
  left: MatDrawer;
  @ViewChild("right", {static: false})
  right: MatDrawer;

  @Input()
  isLoggedIn: boolean = true;

  title = 'ABIS';

  actions: IEvent[] = [];

  constructor(
    private userService: UserService,
    private _router: Router,
    private actionDispatcher: ActionDispatcherService,
    public _dialog: MatDialog,
    private createEntryApi: CreateEntryGQL,
    private deviceService: DeviceDetectorService,
    private _snackBar: MatSnackBar
  ) {
    // Listen to actions ...
    actionDispatcher.onAction.subscribe(action => this.handleAction(action));
    // Listen to router events ...
    _router.events.subscribe(o => this.handleRouterEvents(o));
  }

  ngAfterViewInit(): void {
  }

  private _routeTitle:string;

  private handleAction(action) {
    switch (action.name) {
      case RouteChanged.Name:
        // set the title on the header bar
        this.title = action.data.title;
        this._routeTitle = this.title;

        if (action.data.actions) {
          this.actions = action.data.actions;
        } else {
          this.actions = [];
        }

        if (this.deviceService.isMobile() && this.right.opened) {
          this.actionDispatcher.dispatch(new SetSidebarVisibility("right", "invisible", "base"));
        }
        break;
      case SetApplicationTitle.Name:
        this.title = (<SetApplicationTitle>action).title;
        break;
      case SetSidebarVisibility.Name:
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
          // Every time when the sidebar is hidden, show the route's title in the header.
          this.left.toggle(visibility).then(o => {
            if (o != "close"){
              return;
            }
            this.title = this._routeTitle;
          });
        } else if (action.side == "right") {
          this.right.toggle(visibility);
        }

        if ((<SetSidebarVisibility>action).elevation == "base") {
          if (this.actions.length > 0 && this.actions[0].name == Back.Name) {
            this.actions.shift();
          }
        } else if ((<SetSidebarVisibility>action).elevation == "level1") {
          if (this.actions && this.actions.length < 1 || (this.actions.length > 0 && this.actions[0].name != Back.Name)) {
            this.actions.unshift(new Back());
          }
        }
        break;
      case NestedAction.Name:
        for(let a of (<NestedAction>action).events) {
          this.actionDispatcher.dispatch(a);
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
          this.actionDispatcher.dispatch(new Home());
          return;
        }
        history.back();
        break;
      case Logout.Name:
        this._router.navigate(["/logout"]);
        break;
    }
  }

  private handleRouterEvents(o: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) {
    // if the event is of Type "ActivationEnd" ...
    if (o instanceof ActivationEnd) {
      this.actionDispatcher.dispatch(new RouteChanged(o.snapshot.data));
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
    /*
    const dialogRef = this._dialog.open(InviteComponent, {
      width: '50%',
      minWidth: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
     */
  }
}
