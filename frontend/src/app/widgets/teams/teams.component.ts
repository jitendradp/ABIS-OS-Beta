import {Component} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";


interface DataspaceNode {
  name: string;
  logo?: string;
  icon?: string;
  channels?: DataspaceNode[];
}

const TREE_DATA: DataspaceNode[] = [
  {
    name: 'DBI Analytics GmbH',
    logo: 'https://marketingplatform.google.com/about/partners/img/company/6027496168357888/assets/5686306919153664',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'E.ON Energie Deutschland',
    logo: 'https://i.pinimg.com/280x280_RS/f0/50/5c/f0505ce317dde1b57c017dffe3bc6d34.jpg',
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

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
