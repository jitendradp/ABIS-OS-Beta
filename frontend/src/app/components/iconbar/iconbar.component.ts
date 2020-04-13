import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../search/search.component";
import {SetVisibility} from "../../actions/ui/SetVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Logout} from "../../actions/routes/Logout";
import {UserService} from "../../services/user.service";
import {IAction} from "../../actions/IAction";
import {SetContent} from "../../actions/ui/SetContent";
import {ListGroupComponent} from "../../lists/list-group/list-group.component";
import {ListContactComponent} from "../../lists/list-contact/list-contact.component";
import {ListChatComponent} from "../../lists/list-chat/list-chat.component";
import {NestedAction} from "../../actions/NestedAction";
import {IEvent} from "../../actions/IEvent";
import {ChatComponent} from "../../chat/chat.component";
import {Home} from "../../actions/routes/Home";

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
  orientation: IconBarOrientation;

  @Input()
  membersCount: number;

  @Input()
  description: string;

  @Input()
  onMenu: boolean;

  @Input()
  onChatHeader: boolean;

  _entries:IAction[];

  public get entries() : IAction[] {
    if (!this._entries) {
      const profileList = new SetContent("Groups", "left", ListGroupComponent, "base");
      const contactList = new SetContent("Contacts", "left", ListContactComponent, "base");
      const roomList = new SetContent("Rooms", "left", ListChatComponent, "base");
      const openLeftSidebarBase = new SetVisibility("left", "visible", "base");

      this._entries = [
        new Home(),
        new NestedAction(
          "group",
          "Groups",
          [
            <IEvent>profileList,
            <IEvent>openLeftSidebarBase
          ]),
        new NestedAction(
          "contacts",
          "Contacts",
          [
            <IEvent>contactList,
            <IEvent>openLeftSidebarBase
          ]),
        new NestedAction(
          "group",
          "Groups",
          [
            <IEvent>roomList,
            <IEvent>openLeftSidebarBase
          ])
      ];
    }
    return this._entries;
  }

  constructor(
    private bottomSheet: MatBottomSheet,
    private actionDispatcher: ActionDispatcherService,
    public userService: UserService) {
  }

  openBottomSheet() {
    this.bottomSheet.open(SearchComponent)
  }

  close() {
    this.actionDispatcher.dispatch(new SetVisibility("left", "invisible", "base"));
  }

  logout() {
    this.actionDispatcher.dispatch(new Logout());
  }

  onIconClick($event: MouseEvent, action:IAction) {
    this.actionDispatcher.dispatch(action);
  }
}
