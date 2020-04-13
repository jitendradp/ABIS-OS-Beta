import {Component, Input} from '@angular/core';
import {SetSidebarContent} from "../../actions/ui/SetSidebarContent";
import {ChatComponent} from "../../chat/chat.component";
import {SetSidebarVisibility} from "../../actions/ui/SetSidebarVisibility";
import {NestedAction} from "../../actions/NestedAction";
import {IEvent} from "../../actions/IEvent";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

@Component({
  selector: 'app-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.css']
})
export class CardContactComponent {

  @Input()
  contactPicture: string;

  @Input()
  contactFullName: string;

  @Input()
  subtitle: string;

  @Input()
  context: string;

  constructor(private actionDispatcher: ActionDispatcherService) {
  }

  onClick() {
    const chat = new SetSidebarContent("Chat", "left", ChatComponent, "level1", this.context);
    const openLeftSidebarLevel1 = new SetSidebarVisibility("left", "visible", "level1");

    this.actionDispatcher.dispatch(new NestedAction(
      "chat",
      "Chat",
      [
        <IEvent>chat,
        <IEvent>openLeftSidebarLevel1
      ]));
  }
}
