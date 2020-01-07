import {Component} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {ProfileService} from "../../../services/profile.service";
import {DataspaceService} from "../../../services/dataspace.service";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";
import {SetVisibility} from "../../../actions/ui/sidebar/SetVisibility";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  public dataspace = this.dataspaceService.getDataspaceInformation();

  constructor(
    public profileService: ProfileService,
    public accountService: AccountService,
    private dataspaceService: DataspaceService,
    private actionDispatcher: ActionDispatcherService,
  ) {
  }

  close() {
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible"));
  }
}
