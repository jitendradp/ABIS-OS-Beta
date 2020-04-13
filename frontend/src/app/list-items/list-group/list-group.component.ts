import {Component, OnInit} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {FindRoomsGQL, NewRoomGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {LoginStateChanged} from "../../actions/user/LoginStateChanged";
import {SetContent} from "../../actions/ui/SetContent";
import {CreateRoomComponent} from "../../pages/system/create-room/create-room.component";

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css']
})
export class ListGroupComponent implements OnInit {
  constructor(
    public actionDispatcher: ActionDispatcherService,
    private findRoomsApi:FindRoomsGQL,
    private newRoomSubscription: NewRoomGQL,
    private userService:UserService) {

    this.actionDispatcher.onAction.subscribe(async next => {
      if (next.name == LoginStateChanged.Name) {
        await this.refresh();
      }
    });

    this.newRoomSubscription.subscribe({csrfToken: this.userService.csrfToken})
      .subscribe(async newEntry => {
        console.log(newEntry);
        await this.refresh();
      });
  }

  async ngOnInit() {
    await this.refresh();
  }

  private async refresh() {
    if (!this.userService.profileId) {
      return;
    }

    const rooms = (await this.findRoomsApi.fetch({
      csrfToken: this.userService.csrfToken,
      searchText: ""
    }).toPromise()).data.findRooms;

    this.entries = rooms.map(o => {
      return {
        id: o.id,
        type: "Room",
        name: o.name,
        title: o.title,
        description: o.description,
        logo: o.logo,
        banner: o.banner
      }
    });
  }

  entries: any[] = [];

  onNew() {
    this.actionDispatcher.dispatch(new SetContent("", "dialog", CreateRoomComponent, "base"));
  }
}
