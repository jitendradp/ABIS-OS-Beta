import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  @Input()
  buttonText: string;

  @Input()
  title: string;

  @Input()
  subtitle: string;

}
