import {Component, Input} from '@angular/core';
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent {
  constructor(public _accountService: AccountService) {
  }

  @Input()
  isButton: string;

}
