import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {AccountService} from "../../services/account.service";
import {IAction} from "../../actions/IAction";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

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
  isLoggedIn: boolean = false;

  @Input()
  actions:IAction[] = [];

  get leftActions() : IAction[] {
    return this.actions.filter(o => o.position == "left");
  }
  get rightActions() : IAction[] {
    return this.actions.filter(o => o.position == "right");
  }

  @Output()
  click:EventEmitter<any> = new EventEmitter<any>();


  public profile = this._profileService.getProfileInformation();
  public account = this._accountService.getAccountInformation();

  constructor(
    private _profileService: ProfileService,
    private _accountService: AccountService,
    protected _actionDispatcher: ActionDispatcherService,
  ) {
  }

}
