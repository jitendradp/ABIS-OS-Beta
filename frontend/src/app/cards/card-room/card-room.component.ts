import {Component} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-card-room',
  templateUrl: './card-room.component.html',
  styleUrls: ['./card-room.component.css']
})
export class CardRoomComponent {

  constructor(
    protected roomService: RoomService,
    protected locationService: LocationService,
  ) {
  }

}
