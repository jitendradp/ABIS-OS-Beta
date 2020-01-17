import {Component} from '@angular/core';
import {ActionDispatcherService} from "../services/action-dispatcher.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {FlatTreeControl} from "@angular/cdk/tree";

interface DataspaceNode {
  name: string;
  logo?: string;
  icon?: string;
  channels?: DataspaceNode[];
}

const TREE_DATA: DataspaceNode[] = [
  {
    name: 'My Company',
    logo: 'https://marketingplatform.google.com/about/partners/img/company/6027496168357888/assets/5686306919153664',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'Favorite pizza place',
    logo: 'https://images-platform.99static.com/Ng85_ZR79gbqye5j9TVlBB4uoqU=/500x500/top/smart/99designs-contests-attachments/38/38987/attachment_38987002',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'Reiterhof Maier',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'Dahoam is dahoam', logo: 'https://live.staticflickr.com/8151/7413013712_e55a4f3146_b.jpg',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },

];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  logo: string;
}

/**
 * @title Tree with flat nodes
 */

export interface DirectMessage {
  name: string;
  status: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  private _transformer = (node: DataspaceNode, level: number) => {
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

  constructor(public actionDispatcher: ActionDispatcherService) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  members: DirectMessage[] = [
    {
      name: 'Daniel Janz',
      status: 'offline'
    },
    {
      name: 'Moritz Bönke',
      status: 'offline'
    },
    {
      name: 'Thomas Müller',
      status: 'online'
    },
    {
      name: 'Steve Johnson',
      status: 'offline'
    },
    {
      name: 'Susi Tiel',
      status: 'online'
    },
    {
      name: 'Jasmin Huber',
      status: 'online'
    },
    {
      name: 'Alex Graup',
      status: 'online'
    },
    {
      name: 'Mr. Monkey',
      status: 'offline'
    }
  ];
}
