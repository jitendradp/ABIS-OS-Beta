import {Component, Input, OnInit} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {FlatTreeControl} from "@angular/cdk/tree";
import {FindRoomsGQL, NewRoomGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {LoginStateChanged} from "../../actions/user/LoginStateChanged";
import {filterErrorsAndWarnings} from "@angular/compiler-cli";
import {ITypedElement} from "../../list/ITypedElement";

interface GroupNode {
  name: string;
  logo?: string;
  icon?: string;
  channels?: GroupNode[];
}

let TREE_DATA: GroupNode[] = [
  {
    name: 'My Company',
    logo: 'https://marketingplatform.google.com/about/partners/img/company/6027496168357888/assets/5686306919153664',
    channels: [
      {name: 'Chaos', icon: 'lock'},
      {name: 'General', icon: 'lock'},
      {name: 'Customer Support', icon: 'lock_open'},
      {name: 'Chaos', icon: 'lock_open'},
      {name: 'General', icon: 'lock_open'},
      {name: 'Customer Support', icon: 'lock_open'},
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  logo: string;
}


export interface groupItem {
  name: string;
  title: string;
  creator: string;
  createdAt: string;
  pictureLogo: string;
  description: string;
  membersLive: number;
  membersTotal: number;
  location: string;
  buttonLink: string;
  tags: string;
}

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

}
