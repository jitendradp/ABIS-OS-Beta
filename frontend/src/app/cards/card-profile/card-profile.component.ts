import {Component, Input} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.css']
})
export class CardProfileComponent {

  constructor(
    public profileService: ProfileService,
    public userService: UserService,
    private actionDispatcher: ActionDispatcherService,) {
  }

  close() {
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible"));
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
