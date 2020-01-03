import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent {

  @Input()
  buttonText: string;

  @Input()
  title: string;

  @Input()
  subtitle: string;
}
