import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../search/search.component";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Logout} from "../../actions/routes/Logout";
import {UserService} from "../../services/user.service";
import {IAction} from "../../actions/IAction";
import {SetSidebarContent} from "../../actions/ui/SetSidebarContent";
import {ListGroupComponent} from "../../lists/list-group/list-group.component";
import {ListContactComponent} from "../../lists/list-contact/list-contact.component";
import {ListChatComponent} from "../../lists/list-chat/list-chat.component";
import {NestedAction} from "../../actions/NestedAction";
import {IEvent} from "../../actions/IEvent";

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

  _entries:IAction[];

  public get entries() : IAction[] {
    if (!this._entries) {
      const setGroupList = new SetSidebarContent("left", ListGroupComponent);
      const setContactList = new SetSidebarContent("left", ListContactComponent);
      const setChat = new SetSidebarContent("left", ListChatComponent);
      const openLeftSidebar = new SetSidebarVisibility("left", "visible", "z1");

      this._entries = [
        new NestedAction(
          "group",
          "Groups",
          [
            <IEvent>setGroupList,
            <IEvent>openLeftSidebar
          ]),
        new NestedAction(
          "contacts",
          "Contacts",
          [
            <IEvent>setContactList,
            <IEvent>openLeftSidebar
          ]),
        new NestedAction(
          "group",
          "Groups",
          [
            <IEvent>setChat,
            <IEvent>openLeftSidebar
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
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible", "z1"));
  }

  logout() {
    this.actionDispatcher.dispatch(new Logout());
  }

  onIconClick($event: MouseEvent, action:IAction) {
    this.actionDispatcher.dispatch(action);
  }
}
