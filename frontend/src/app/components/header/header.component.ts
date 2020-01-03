import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {ToggleVisibility} from "../../actions/ui/sidebar/ToggleVisibility";
import {IAction} from "../../actions/IAction";

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
    return this.actions.filter((o: IAction) => o.name == ToggleVisibility.Name).filter((o: ToggleVisibility) => o.side == "left");
  }

  get rightActions(): IAction[] {
    return this.actions.filter((o: IAction) => o.name == ToggleVisibility.Name).filter((o: ToggleVisibility) => o.side == "right");
  }

  @Output()
  click: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _actionDispatcher: ActionDispatcherService,
  ) {
  }

}
