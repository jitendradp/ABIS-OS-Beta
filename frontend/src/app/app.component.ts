import {Component} from '@angular/core';
import {ProfileService} from "./services/profile.service";
import {DataspaceService} from "./services/dataspace.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';

  public profile = {};

  public dataspace = {};

  constructor(
    private _profileService: ProfileService,
    private _dataspaceService: DataspaceService,
  ) {
  }

  ngOnInit() {
    this.profile = this._profileService.getProfileInformation();
    this.dataspace = this._dataspaceService.getDataspaceInformation();
  }
}
