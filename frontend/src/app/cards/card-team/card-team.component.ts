import {Component} from '@angular/core';
import {TeamService} from "../../services/team.service";

@Component({
  selector: 'app-card-team',
  templateUrl: './card-team.component.html',
  styleUrls: ['./card-team.component.css']
})
export class CardTeamComponent {

  public team:{name?:string,logo?:string,nickname?:string,description?:string,tags?:string,address?:string,city?:string,activeUsers?:number} = {};


  constructor(
    private _teamService: TeamService,
  ) {
  }

  ngOnInit() {
    this.team = this._teamService.getTeamInformation();
  }

}
