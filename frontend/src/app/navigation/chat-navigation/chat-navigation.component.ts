import {Component, ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {SetSidebarContent} from "../../actions/ui/SetSidebarContent";
import {IEvent} from "../../actions/IEvent";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Elevation, SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";

@Component({
  selector: 'app-chat-navigation',
  templateUrl: './chat-navigation.component.html',
  styleUrls: ['./chat-navigation.component.css']
})
export class ChatNavigationComponent {

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
        this.components[(<any>action).elevation] = (<any>action).component;

        if (this.elevation.toString() === (<any>action).elevation.toString()) {
          this.setContent(action);
        }
        break;
    }
  }

  setContent(action:any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.components[action.elevation]);
    this.contentContainer1.clear();
    const ref = this.contentContainer1.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
