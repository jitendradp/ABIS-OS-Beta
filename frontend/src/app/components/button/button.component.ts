import {Component, Input} from '@angular/core';

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

}
