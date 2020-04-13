import {Component, Input} from '@angular/core';
import {SetContent} from "../../actions/ui/SetContent";
import {ChatComponent} from "../../chat/chat.component";
import {SetVisibility} from "../../actions/ui/SetVisibility";
import {NestedAction} from "../../actions/NestedAction";
import {IEvent} from "../../actions/IEvent";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";

@Component({
  selector: 'app-card-list-entry',
  templateUrl: './card-list-entry.component.html',
  styleUrls: ['./card-list-entry.component.css']
})
export class CardListEntryComponent {

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
    const chat = new SetContent("Chat", "left", ChatComponent, "level1", this.context);
    const openLeftSidebarLevel1 = new SetVisibility("left", "visible", "level1");

    this.actionDispatcher.dispatch(new NestedAction(
      "chat",
      "Chat",
      [
        <IEvent>chat,
        <IEvent>openLeftSidebarLevel1
      ]));
  }
}
