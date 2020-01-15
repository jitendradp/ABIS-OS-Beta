import {Component, Input} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent {
  constructor(public _userService: UserService) {
  }

  @Input()
  isButton: string;

}
