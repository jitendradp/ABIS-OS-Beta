import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../search/search.component";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Logout} from "../../actions/routes/Logout";
import {UserService} from "../../services/user.service";

export interface IconList {
  name: string;
  metric?: string;
  label?: string;
  action?: string;
  color?: string;
}


export enum IconBarOrientation {
  "Horizontal",
  "Vertical"
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
  orientation:IconBarOrientation;

  @Input()
  membersCount: number;

  @Input()
  description: string;

  @Input()
  onMenu: boolean;

  @Input()
  onChatHeader: boolean;

  constructor(
    private bottomSheet: MatBottomSheet,
    private actionDispatcher: ActionDispatcherService,
    public userService: UserService) {
  }

  openBottomSheet() {
    this.bottomSheet.open(SearchComponent)
  }

  close() {
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible", "z1"));
  }

  logout() {
    this.actionDispatcher.dispatch(new Logout());
  }

  onIconClick($event: MouseEvent) {

  }
}
