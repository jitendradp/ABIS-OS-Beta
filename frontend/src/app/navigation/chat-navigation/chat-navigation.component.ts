import {Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {SetSidebarContent} from "../../actions/ui/SetSidebarContent";
import {IEvent} from "../../actions/IEvent";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

@Component({
  selector: 'app-chat-navigation',
  templateUrl: './chat-navigation.component.html',
  styleUrls: ['./chat-navigation.component.css']
})
export class ChatNavigationComponent {
  @Input()
  mode: string = "Small";

  @ViewChild('contentContainer1', { static: false })
  contentContainer1: ViewContainerRef;

  @ViewChild('contentContainer2', { static: false })
  contentContainer2: ViewContainerRef;

  constructor(private actionDispatcher: ActionDispatcherService
  ,private componentFactoryResolver: ComponentFactoryResolver) {
    actionDispatcher.onAction.subscribe(action => this.onAction(action));
  }

  onAction(action:IEvent) {
    switch (action.name) {
      case SetSidebarContent.Name:
        if (this.mode == "Small") {
          const factory = this.componentFactoryResolver.resolveComponentFactory((<any>action).component);
          const ref = this.contentContainer1.createComponent(factory);
          ref.changeDetectorRef.detectChanges();
        }
      break;
    }
  }

}
