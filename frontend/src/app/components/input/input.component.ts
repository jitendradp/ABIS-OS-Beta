import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input()
  inputValue: string;

  @Input()
  color: string;

  @Input()
  type: string;

  @Input()
  appearance: string;

  @Input()
  placeholder: string;

  @Input()
  placeholderIconPrefix: string;

  @Input()
  hint: string;

  @Input ()
  showHint: boolean;

  @Input ()
  showPlaceholderIconPrefix: boolean;

}
