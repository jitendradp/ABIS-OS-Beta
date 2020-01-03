import {Component} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {ProfileService} from "../../../services/profile.service";
import {DataspaceService} from "../../../services/dataspace.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  public profile = this._profileService.getProfileInformation();
  public account = this._accountService.getAccountInformation();
  public dataspace = this._dataspaceService.getDataspaceInformation();

  constructor(
    private _profileService: ProfileService,
    private _accountService: AccountService,
    private _dataspaceService: DataspaceService,
  ) {
  }

}
