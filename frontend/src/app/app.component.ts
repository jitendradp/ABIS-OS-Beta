// TODO: Remove all <any> casts
import {AfterViewInit, Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef} from '@angular/core';
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
import {Home} from "./actions/routes/Home";
import {ShowNotification} from "./actions/ui/ShowNotification";
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogEntry} from "./services/logger.service";
import {Back} from "./actions/routes/Back";
import {SetVisibility} from "./actions/ui/SetVisibility";
import {DeviceDetectorService} from "ngx-device-detector";
import {RouteChanged} from "./actions/routes/RouteChanged";
import {ListGroupComponent} from "./lists/list-group/list-group.component";
import {Logout} from "./actions/routes/Logout";
import {UserService} from "./services/user.service";
import {CreateEntryGQL} from "../generated/abis-api";
import {NestedAction} from "./actions/NestedAction";
import {SetApplicationTitle} from "./actions/ui/SetApplicationTitle";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {SetContent} from "./actions/ui/SetContent";
import {Detail} from "./actions/routes/Detail";
import {MatDialogConfig} from "@angular/material/dialog";

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
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private actionDispatcher: ActionDispatcherService,
    public dialog: MatDialog,
    private createEntryApi: CreateEntryGQL,
    private deviceService: DeviceDetectorService,
    private _snackBar: MatSnackBar
  ) {
    // Listen to actions ...
    actionDispatcher.onAction.subscribe(action => this.handleAction(action));
    // Listen to router events ...
    router.events.subscribe(o => this.handleRouterEvents(o));
  }

  ngAfterViewInit(): void {
  }

  private _routeTitle:string;
  private _sidebarOpen:boolean;

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
          this.actionDispatcher.dispatch(new SetVisibility("right", "invisible", "base"));
        }
        this.maintainBackState();
        break;
      case SetApplicationTitle.Name:
        this.title = (<SetApplicationTitle>action).title;
        break;
      case SetContent.Name:
        if ((<any>action).side == "bottom") {
          this.bottomSheet.open((<any>action).component);
        }
        if ((<any>action).side == "dialog") {
          // TODO: context
          this.openDialog((<any>action).component, '50%', '50%', (<any>action).context);
        }
        if ((<any>action).side == "full") {
          if ((<any>action).title) {
            this._routeTitle = (<any>action).title;
            this.title = (<any>action).title;
          }
        }
        break;
      case SetVisibility.Name:
        let visibility: boolean = false;

        if (!(<SetVisibility>action).elevation) {
          return;
        }

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
            this._sidebarOpen = o != "close";
            this.maintainBackState();
            if (!this._sidebarOpen) {
              this.title = this._routeTitle;
            }
          });
        } else if (action.side == "right") {
          this.right.toggle(visibility);
        }
        break;
      case NestedAction.Name:
        for(let a of (<NestedAction>action).events) {
          this.actionDispatcher.dispatch(a);
        }
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
        this.router.navigate(["/"]);
        break;
      case Detail.Name:
        this.router.navigate(["/detail"]);
        break;
      case Back.Name:
        if (this._sidebarOpen) {
          this.actionDispatcher.dispatch(new SetVisibility("left", "invisible", null));
          return;
        }

        if (document.referrer == "") {
          this.actionDispatcher.dispatch(new Home());
          return;
        }
        history.back();
        break;
      case Logout.Name:
        this.router.navigate(["/logout"]);
        break;
    }
  }

  private maintainBackState() {
    if (this._sidebarOpen) {
      if (this.actions && this.actions.length < 1 || (this.actions.length > 0 && this.actions[0].name != Back.Name)) {
        this.actions.unshift(new Back());
      }
    } else {
      if (this.actions.length > 0 && this.actions[0].name == Back.Name) {
        this.actions.shift();
      }
    }
  }

  private handleRouterEvents(o: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) {
    // if the event is of Type "ActivationEnd" ...
    if (o instanceof ActivationEnd) {
      this.actionDispatcher.dispatch(new RouteChanged(o.snapshot.data));
    }
  }

  public openDialog(componentType:any, width:string, height: string, context?:any): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = width;
    dialogConfig.height = height;
    dialogConfig.data = context;

    const dialogRef = this.dialog.open(componentType, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed:', result);
    });
  }


  public openGroupExploreDialog(): void {
    const dialogRef = this.dialog.open(ListGroupComponent, {
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
