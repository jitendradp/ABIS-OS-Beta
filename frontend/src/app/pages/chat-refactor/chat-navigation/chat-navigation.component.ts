import {Component} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {SetVisibility} from "../../../actions/ui/sidebar/SetVisibility";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {ActionDispatcherService} from "../../../services/action-dispatcher.service";

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
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
    ]
  },
  {
    name: 'Dahoam is dahoam', logo: 'https://www.freelogodesign.org/Content/img/logo-samples/flooop.png',
    channels: [
      {name: 'Chaos', icon: 'bubble_chart'},
      {name: 'General', icon: 'bubble_chart'},
      {name: 'Customer Support', icon: 'bubble_chart'},
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


@Component({
  selector: 'app-chat-navigation',
  templateUrl: './chat-navigation.component.html',
  styleUrls: ['./chat-navigation.component.css']
})
export class ChatNavigationComponent {


  close() {
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible"));
  }

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

  constructor(
    public actionDispatcher: ActionDispatcherService) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
