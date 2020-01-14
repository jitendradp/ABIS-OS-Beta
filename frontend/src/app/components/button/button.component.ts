import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input()
  link: string;

  @Input()
  text: string;

  @Input()
  stepper: string;

  @Input()
  icon: string;

  @Input()
  showButtonIcon: string;

  @Input()
  isDisabled: boolean;

  @Input()
  lessStyle: boolean = false;


  @Output()
  click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(protected _accountService: AccountService) {
  }

}
