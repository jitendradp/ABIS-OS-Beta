import {Component, Input} from '@angular/core';
import {WorkspaceService} from "../../services/workspace.service";
import {ProfileService} from "../../services/profile.service";

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  @Input()
  isLoggedIn: boolean;

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

  channels: Section[] = [
    {
      name: 'Chaos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'General',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Marketing',
      updated: new Date('1/28/16'),
    }
  ];
  members: Section[] = [
    {
      name: 'Daniel Janz',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Moritz Bönke',
      updated: new Date('1/18/16'),
    }
  ];
}
