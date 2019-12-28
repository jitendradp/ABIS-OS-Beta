import {Component, Input} from '@angular/core';
import {WorkspaceService} from "../../services/workspace.service";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  @Input()
  isLoggedIn: boolean = true;

  public profile = {};

  public workspace = {};

  constructor(
    private _profileService: ProfileService,
    private _workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit() {
    this.profile = this._profileService.getProfileInformation();
    this.workspace = this._workspaceService.getWorkspaceInformation();
  }
}
