import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {DataspaceService} from "../../services/dataspace.service";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input()
  link: string;

  @Input()
  image: string;

  @Input()
  showImage: boolean;

  @Input()
  showButton: boolean;

  @Input()
  subtitle: string;

  @Input()
  showIcon: boolean;

  @Input()
  icon: string;

  @Input()
  title: string;

  @Input()
  isLoggedIn: boolean = false;

  @Output()
  click:EventEmitter<any> = new EventEmitter<any>();


  public profile = this._profileService.getProfileInformation();
  public account = this._accountService.getAccountInformation();

  constructor(
    private _profileService: ProfileService,
    private _accountService: AccountService,
  ) {
  }

}
