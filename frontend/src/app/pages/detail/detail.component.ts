import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {SetContent} from "../../actions/ui/SetContent";
import {SetApplicationTitle} from "../../actions/ui/SetApplicationTitle";
import {IAction} from "../../actions/IAction";
import {Router} from "@angular/router";
import {Home} from "../../actions/routes/Home";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements AfterViewInit {

  fullscreenComponent:any;

  @ViewChild('fullscreenContainer', {static: false, read: ViewContainerRef})
  fullscreenContainer: ViewContainerRef;

  constructor(private actionDispatcher: ActionDispatcherService
             ,private componentFactoryResolver: ComponentFactoryResolver) {
    actionDispatcher.onAction.subscribe(action => this.handleAction(action));
  }

  lastAction:IAction;

  ngAfterViewInit(): void {
    this.setContent();
  }

  private handleAction(action) {
    switch (action.name) {
      case SetContent.Name:
        if ((<any>action).side == "full") {
          this.lastAction = action;
          this.setContent();
        }
        break;
    }
  }

  private setContent() {
    setTimeout(() => {
      this.fullscreenContainer.clear();

      setTimeout(() => {
        if (!this.lastAction) {
          this.actionDispatcher.dispatch(new Home());
          return;
        }

        this.fullscreenContainer.clear();
        this.fullscreenComponent = (<any>this.lastAction).component;
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.fullscreenComponent);
        const ref = this.fullscreenContainer.createComponent(factory);
        if ((<any>this.lastAction).context) {
          // TODO: Pass "groupId" to ChatComponent in a more robust way
          (<any>ref.instance).groupId = (<any>this.lastAction).context.id;
          (<any>ref.instance).title = (<any>this.lastAction).context.name;
        }
        if ((<any>this.lastAction).title) {
          this.actionDispatcher.dispatch(new SetApplicationTitle((<any>this.lastAction).title));
        }
        ref.changeDetectorRef.detectChanges();
      }, 0);
    }, 0);
  }

}
