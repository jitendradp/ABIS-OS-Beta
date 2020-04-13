import {AfterViewInit, Component, Input} from '@angular/core';
import {GetEntriesGQL} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-card-chat',
  templateUrl: './card-chat.component.html',
  styleUrls: ['./card-chat.component.css']
})
export class CardChatComponent implements AfterViewInit{

  @Input()
  chatGroupLogo: string;

  @Input()
  chatGroupTitle: string;

  @Input()
  chatGroupSubtitle: string;

  @Input()
  chatGroupMembersCount: number;

  @Input()
  chatGroupDescription: string;

  @Input()
  groupId:string;

  private entries: any[] = [];

  constructor(private getEntries: GetEntriesGQL
            , private userService: UserService) {
  }

  ngAfterViewInit(): void {
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
         newArr.push(o.data.getEntries[i]);
      }
      this.entries = newArr;
    });
  }

}
