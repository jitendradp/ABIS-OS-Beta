import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent{
  createRoomService: string;

  constructor(private userService: UserService) {
    this.createRoomService = this.userService.systemServices.find(o => o.name == "CreateRoomService").id;
  }
}
