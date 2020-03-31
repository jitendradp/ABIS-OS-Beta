import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../search/search.component";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Logout} from "../../actions/routes/Logout";

export interface IconList {
  name: string;
  metric?: string;
  label?: string;
  action?: string;
  color?: string;
}

@Component({
  selector: 'app-iconbar',
  templateUrl: './iconbar.component.html',
  styleUrls: ['./iconbar.component.css']
})
export class IconbarComponent {

  @Input()
  onCockpit: boolean;


  @Input()
  onLeftSide: boolean;

  @Input()
  membersCount: number;

  @Input()
  description: string;

  @Input()
  onMenu: boolean;

  @Input()
  onChatHeader: boolean;

  @Input()
  onFooter: boolean;

  icons: IconList [] = [
    {
      metric: 'Margin',
      name: 'trending_down',
      label: '-23% | -3.579 Euro',
      action: '',
      color: '#f44336',
    },
    {
      metric: 'Revenue',
      name: 'trending_up',
      label: '+483% | +306.736 Euro',
      action: '',
      color: '#2ecc71',
    },
    {
      metric: 'Costs',
      name: 'trending_flat',
      label: '+0,1% | +73 Euro',
      action: '',
      color: '#204AAB',
    }
  ];

  constructor(
    private bottomSheet: MatBottomSheet,
    private actionDispatcher: ActionDispatcherService) {
  }

  openBottomSheet() {
    this.bottomSheet.open(SearchComponent)
  }

  close() {
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible"));
  }

  logout() {
    this.actionDispatcher.dispatch(new Logout());
  }
}
