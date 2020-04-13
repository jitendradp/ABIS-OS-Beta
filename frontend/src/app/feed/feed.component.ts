import {Component, Input} from '@angular/core';
import {GetEntriesGQL} from "../../generated/abis-api";
import {UserService} from "../services/user.service";

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
        (<any>o.data.getEntries[i]).groupId = this.groupId;
        newArr.push(o.data.getEntries[i]);
      }
      this.entries = newArr;
    });
  }

}
