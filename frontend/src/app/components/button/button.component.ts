import {Component, EventEmitter, Input, Output} from '@angular/core';

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

  @Output()
  click:EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

}
