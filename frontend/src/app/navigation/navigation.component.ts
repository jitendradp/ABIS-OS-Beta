import {Component} from '@angular/core';
import {SetSidebarVisibility} from "../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../services/action-dispatcher.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(
    private actionDispatcher: ActionDispatcherService,
  ) {
  }

  close() {
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible"));
  }
}
