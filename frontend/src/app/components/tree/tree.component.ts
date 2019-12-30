import {Component} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";


interface DataspaceNode {
  name: string;
  icon?: string;
  channels?: DataspaceNode[];
}

const TREE_DATA: DataspaceNode[] = [
  {
    name: 'DBI Analytics GmbH',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'E.ON Energie Deutschland',
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
    name: 'Dahoam is dahoam',
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
}

/**
 * @title Tree with flat nodes
 */

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent {
  private _transformer = (node: DataspaceNode, level: number) => {
    return {
      expandable: !!node.channels && node.channels.length > 0,
      name: node.name,
      icon: node.icon,
      level: level,
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
