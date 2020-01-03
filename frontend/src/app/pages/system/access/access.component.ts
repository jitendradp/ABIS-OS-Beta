import {Component} from '@angular/core';
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent {
  constructor(protected accountService:AccountService) {
  }

}
