import {Component, Input} from '@angular/core';
import {MatBottomSheet} from "@angular/material";
import {SearchComponent} from "../../search/search.component";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {Logout} from "../../actions/routes/Logout";
import {UserService} from "../../services/user.service";
import {IAction} from "../../actions/IAction";
import {SetSidebarContent} from "../../actions/ui/SetSidebarContent";
import {ListGroupComponent} from "../../list-items/list-group/list-group.component";
import {ListContactComponent} from "../../list-items/list-contact/list-contact.component";
import {ListChatComponent} from "../../list-items/list-chat/list-chat.component";
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
      const profileList = new SetSidebarContent("Groups", "left", ListGroupComponent, "base");
      const contactList = new SetSidebarContent("Contacts", "left", ListContactComponent, "base");
      const roomList = new SetSidebarContent("Rooms", "left", ListChatComponent, "base");
      const chat = new SetSidebarContent("Chat", "left", ChatComponent, "level1");
      const openLeftSidebarBase = new SetSidebarVisibility("left", "visible", "base");
      const openLeftSidebarLevel1 = new SetSidebarVisibility("left", "visible", "level1");

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
          ]),
        new NestedAction(
          "chat",
          "Chat",
          [
            <IEvent>chat,
            <IEvent>openLeftSidebarLevel1
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
    this.actionDispatcher.dispatch(new SetSidebarVisibility("left", "invisible", "base"));
  }

  logout() {
    this.actionDispatcher.dispatch(new Logout());
  }

  onIconClick($event: MouseEvent, action:IAction) {
    this.actionDispatcher.dispatch(action);
  }
}
