import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent{
  inviteService: string;

  constructor(private userService: UserService) {
    this.inviteService = this.userService.systemServices.find(o => o.name == "InviteService").id;
  }
}
