import {Component, Input, OnInit} from '@angular/core';
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {FlatTreeControl} from "@angular/cdk/tree";
import {FindRoomsGQL, NewRoomGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {LoginStateChanged} from "../../actions/user/LoginStateChanged";
import {filterErrorsAndWarnings} from "@angular/compiler-cli";

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

  @Input()
  collapsed: boolean;

  @Input()
  showSearch: boolean = true;

  @Input()
  showActions: boolean;

  @Input()
  asTree: boolean;

  @Input()
  asDialogList: boolean = true;

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
    if (!this.userService.isLoggedOn) {
      return;
    }

    const rooms = (await this.findRoomsApi.fetch({
      csrfToken: this.userService.csrfToken,
      searchText: ""
    }).toPromise()).data.findRooms;

    TREE_DATA[0].name = this.userService.accountInformation.personFirstName + " " + this.userService.accountInformation.personLastName;
    TREE_DATA[0].channels = rooms.map(o => {
      return {
        name: o.name,
        icon: o.logo
      }
    });

    this.dataSource.data = TREE_DATA;
  }

  private _transformer = (node: GroupNode, level: number) => {
    return {
      expandable: !!node.channels && node.channels.length > 0,
      name: node.name,
      icon: node.icon,
      level: level,
      logo: node.logo
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.channels);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  groups: groupItem [] = [
    {
      name: 'tum',
      title: 'TU München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://picsum.photos/200',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      name: 'bcg',
      title: 'Boston Group',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Simon Says',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://source.unsplash.com/random',
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    },
    {
      name: 'fhm',
      title: 'Hochschule München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://loremflickr.com/320/240',
      description: 'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    },
    {
      name: 'hit',
      title: 'HIT Einkaufsladen',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Joe Mo',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'http://www.funcage.com/photos/1156765521_28_podborka_35.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      name: 'fhm',
      title: 'Hochschule München',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Mr. Monkey',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'https://loremflickr.com/320/240',
      description: 'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    },
    {
      name: 'hit',
      title: 'HIT Einkaufsladen',
      tags: '#uni, #abis',
      buttonLink: 'chat',
      location: 'Dieselstr. 22b in 85551 Kirchheim (DE)',
      membersLive: 39,
      membersTotal: 89,
      creator: 'Joe Mo',
      createdAt: 'Friday, 2020-01-01 9:15 AM',
      pictureLogo: 'http://www.funcage.com/photos/1156765521_28_podborka_35.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ];

}
