import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {

  @Input()
  isFormInput: boolean;

  @Input()
  text: string;

  @Input()
  linkText: string;

  @Input()
  link: string;

}
