import {Component} from '@angular/core';
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {SetVisibility} from "../../../actions/ui/sidebar/SetVisibility";

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
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible"));
  }
}
