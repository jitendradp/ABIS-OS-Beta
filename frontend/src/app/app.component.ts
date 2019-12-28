import {Component} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {WorkspaceService} from "./services/workspace.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';

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
