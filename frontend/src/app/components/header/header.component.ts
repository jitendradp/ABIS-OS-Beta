import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {IAction} from "../../actions/IAction";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  @Input()
  icon: string;

  @Input()
  title: string;

  @Input()
  actions: IAction[] = [];

  get leftActions(): IAction[] {
    return this.actions.filter((o: SetSidebarVisibility) => o.side == "left");
  }

  get midActions(): IAction[] {
    return this.actions.filter((o: SetSidebarVisibility) =>
      o.side == "middle");
  }

  get rightActions(): IAction[] {
    return this.actions.filter((o: SetSidebarVisibility) => o.side == "right");
  }

  @Output()
  click: EventEmitter<any> = new EventEmitter<any>();

  constructor (fb: FormBuilder, public actionDispatcher: ActionDispatcherService) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }
}
