import {Component, Input} from '@angular/core';
import {UserService} from "../../services/user.service";

export interface feedItem {
  creator: string;
  createdAt: string;
  pictureCreator: string;
  picturePost: string;
  message: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
}

@Component({
  selector: 'app-feed-message',
  templateUrl: './feed-message.component.html',
  styleUrls: ['./feed-message.component.css']
})
export class FeedMessageComponent {

  @Input()
  private entries: any[] = [];
  @Input()
  private groupId: string = "";

  constructor(public userService:UserService) {
  }


}
