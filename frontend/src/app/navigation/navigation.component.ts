import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {Elevation, SetVisibility} from "../actions/ui/SetVisibility";
import {ActionDispatcherService} from "../services/action-dispatcher.service";
import {IEvent} from "../actions/IEvent";
import {SetContent} from "../actions/ui/SetContent";
import {SetApplicationTitle} from "../actions/ui/SetApplicationTitle";

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
    , private componentFactoryResolver: ComponentFactoryResolver) {
    actionDispatcher.onAction.subscribe(action => this.onAction(action));
  }

  onAction(action: IEvent) {
    switch (action.name) {
      case SetVisibility.Name:
        const a = <SetVisibility>action;
        if (a.state == "invisible" && !a.elevation) {
          // Close either the whole sidebar or only the higher layer
          if (this.elevation == "level1") {
            this.elevation = "base";
            this.setElevationContent((<any>action).context);
          } else if (this.elevation == "base") {
            this.actionDispatcher.dispatch(new SetVisibility("left", "invisible", "base"));
          }
          return;
        }
        if (a.elevation != this.elevation) {
          this.elevation = a.elevation;
          this.setElevationContent((<any>action).context);
        }
        break;
      case SetContent.Name:
        if ((<any>action).side == "bottom"
        || (<any>action).side == "dialog") {
          return;
        }
        this.components[(<any>action).elevation] = { title: (<any>action).title, component: (<any>action).component, context: (<any>action).context };

        if (this.elevation.toString() === (<any>action).elevation.toString()) {
          this.setElevationContent((<any>action).context);
        }
        break;
    }
  }

  setElevationContent(context?:string) {
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
}
