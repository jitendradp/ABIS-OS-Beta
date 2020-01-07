import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {IAction} from "../../actions/IAction";
import {SetVisibility} from "../../actions/ui/sidebar/SetVisibility";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input()
  icon: string;

  @Input()
  title: string;

  @Input()
  actions: IAction[] = [];

  get leftActions(): IAction[] {
    return this.actions.filter((o: IAction) => o.name == SetVisibility.Name).filter((o: SetVisibility) => o.side == "left");
  }

  get rightActions(): IAction[] {
    return this.actions.filter((o: IAction) => o.name == SetVisibility.Name).filter((o: SetVisibility) => o.side == "right");
  }

  @Output()
  click: EventEmitter<any> = new EventEmitter<any>();

  constructor(public actionDispatcher: ActionDispatcherService) {
  }

}
