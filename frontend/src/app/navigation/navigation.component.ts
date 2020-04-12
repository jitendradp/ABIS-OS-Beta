import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {Elevation, SetSidebarVisibility} from "../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../services/action-dispatcher.service";
import {IEvent} from "../actions/IEvent";
import {SetSidebarContent} from "../actions/ui/SetSidebarContent";
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
      case SetSidebarVisibility.Name:
        const a = <SetSidebarVisibility>action;
        if (a.elevation != this.elevation) {
          this.elevation = a.elevation;
          this.setContent(action);
        }
        break;
      case SetSidebarContent.Name:
        this.components[(<any>action).elevation] = { title: (<any>action).title, component: (<any>action).component };

        if (this.elevation.toString() === (<any>action).elevation.toString()) {
          this.setContent(action);
        }
        break;
    }
  }

  setContent(action:any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.components[action.elevation].component);
    this.contentContainer1.clear();
    const ref = this.contentContainer1.createComponent(factory);
    this.actionDispatcher.dispatch(new SetApplicationTitle(this.components[action.elevation].title));
    ref.changeDetectorRef.detectChanges();
  }
}
