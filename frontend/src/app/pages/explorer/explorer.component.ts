import { Component } from '@angular/core';
import {TeamService} from "../../services/team.service";

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent {

  public team = {};


  constructor(
    private _teamService: TeamService,
  ) {
  }

  ngOnInit() {
    this.team = this._teamService.getTeamInformation();
  }


}
