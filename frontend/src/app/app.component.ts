import {Component} from '@angular/core';
import {ProfileService} from "./services/profile.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';

  public profile = {};

  constructor(private _profileService: ProfileService) {
  }

  ngOnInit() {
    this.profile = this._profileService.getProfileInformation();
  }
}
