import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {Elevation, SetVisibility} from "../actions/ui/SetVisibility";
import {ActionDispatcherService} from "../services/action-dispatcher.service";
import {IEvent} from "../actions/IEvent";
import {SetContent} from "../actions/ui/SetContent";
import {SetApplicationTitle} from "../actions/ui/SetApplicationTitle";
import {Detail} from "../actions/routes/Detail";
import {RouteChanged} from "../actions/routes/RouteChanged";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  elevation: Elevation = "base";
  components: { [elevation: string]: any } = {};

  @ViewChild('contentContainer1', {static: false, read: ViewContainerRef})
  contentContainer1: ViewContainerRef;

  constructor(private actionDispatcher: ActionDispatcherService
    , private componentFactoryResolver: ComponentFactoryResolver
    , private router: Router) {
    actionDispatcher.onAction.subscribe(action => this.onAction(action));
  }

  waitForRouteChange:boolean = false;

  onAction(action: IEvent) {
    switch (action.name) {
      case RouteChanged.Name:
        if (!this.waitForRouteChange) {
          return;
        }
        this.waitForRouteChange = false;
        this.setDetailContentAndCloseSidebar();
        break;
      case SetVisibility.Name:
        const a = <SetVisibility>action;
        if (a.state == "invisible" && !a.elevation) {
          // Close either the whole sidebar or only the higher layer
          if (this.elevation == "level1") {
            this.elevation = "base";
            this.setElevationContent();
          } else if (this.elevation == "base") {
            this.actionDispatcher.dispatch(new SetVisibility("left", "invisible", "base"));
          }
          return;
        }
        if (a.elevation != this.elevation) {
          this.elevation = a.elevation;
          this.setElevationContent();
        }
        break;
      case SetContent.Name:
        if ((<any>action).side == "bottom"
          || (<any>action).side == "dialog"
          || (<any>action).side == "full") {
          return;
        }
        this.components[(<any>action).elevation] = {
          title: (<any>action).title,
          component: (<any>action).component,
          context: (<any>action).context
        };

        if (this.elevation.toString() === (<any>action).elevation.toString()) {
          this.setElevationContent();
        }
        break;
    }
  }

  private setDetailContentAndCloseSidebar() {
    const level = this.components[this.elevation];
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible", null));
    this.actionDispatcher.dispatch(new SetContent(level.title, "full", level.component, "base", level.context));
  }

  setElevationContent() {
    const level = this.components[this.elevation];
    const factory = this.componentFactoryResolver.resolveComponentFactory(level.component);
    this.contentContainer1.clear();
    const ref = this.contentContainer1.createComponent(factory);
    if (level.context) {
      // TODO: Pass "groupId" to ChatComponent in a more robust way
      (<any>ref.instance).groupId = level.context.id;
      (<any>ref.instance).title = level.context.name;
    }
    this.actionDispatcher.dispatch(new SetApplicationTitle(level.title));
    ref.changeDetectorRef.detectChanges();
  }

  showAsMainContent() {
    this.actionDispatcher.dispatch(new Detail());
    this.waitForRouteChange = this.router.url != '/detail';
    if (!this.waitForRouteChange) {
      this.setDetailContentAndCloseSidebar();
    }
  }
}
