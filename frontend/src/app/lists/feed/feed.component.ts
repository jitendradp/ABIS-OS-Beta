import {Component, Input} from '@angular/core';
import {ContentEncoding, GetEntriesGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";
import {ActionDispatcherService} from "../../services/action-dispatcher.service";
import {SetContent} from "../../actions/ui/SetContent";
import {CreateEntryEditorComponent} from "../../components/create-entry-editor/create-entry-editor.component";
import {IEvent} from "../../actions/IEvent";
import {NewEntryEvent} from "../../actions/newEntryEvent";
import {NewTagEvent} from "../../actions/newTagEvent";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  @Input()
  groupId: string;

  @Input()
  title:string = "";

  private entries: any[] = [];
  memberCount: any;
  descritption: any;
  icon: any;

  constructor(private getEntries: GetEntriesGQL
    , private userService: UserService
    , private actionDispatcher: ActionDispatcherService) {

    const self = this;
    this.actionDispatcher.onAction.subscribe(next => self.onAction.call(self, next));
  }

  private onAction(action: IEvent) {
    switch (action.name) {
      case NewEntryEvent.Name:
        if (this.groupId !== (<NewEntryEvent>action).entry.containerId) {
          return;
        }
        this.reload();
        break;
      case  NewTagEvent.Name:
        const a = <NewTagEvent>action;
        this.entries.forEach(o => {
          if (o["id"] != a.tag.forId) {
            return;
          }
          // TODO: strange TagAggregate update
          o.tagAggregate.find(o => o.type == a.tag.tagType).count++;
        });
        break;
    }
  }

  ngAfterViewInit(): void {
    this.reload();
  }

  private _entryIds:string[] = [];

  private reload() {
    if (!this.groupId) {
      return;
    }
    (this.getEntries.fetch({
      groupId: this.groupId,
      csrfToken: this.userService.csrfToken
    }).toPromise()).then(o => {
      const newArr = [];
      const maxCount = 10;
      for (let i = 0; i < (o.data.getEntries.length > maxCount ? maxCount : o.data.getEntries.length); i++) {
        (<any>o.data.getEntries[i]).groupId = this.groupId;
        newArr.push(o.data.getEntries[i]);
      }
      this.entries = newArr;
    });
  }

  async newEntry(contentEncoding: ContentEncoding) {
    this.actionDispatcher.dispatch(new SetContent("New Entry", "dialog", CreateEntryEditorComponent, "base", {inGroupId:this.groupId, contentEncodingId:contentEncoding.id}));
  }
}
