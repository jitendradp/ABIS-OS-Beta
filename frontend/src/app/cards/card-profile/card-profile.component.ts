import {Component, Input} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {UserService} from "../../services/user.service";
import {SetVisibility} from "../../actions/ui/sidebar/SetVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.css']
})
export class CardProfileComponent {

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private actionDispatcher: ActionDispatcherService,) {
  }

  close() {
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible"));
  }

  @Input()
  collapsed: boolean;

  @Input()
  showContent: boolean;

  @Input()
  onMenu: boolean;

  @Input()
  onPage: boolean;

}
