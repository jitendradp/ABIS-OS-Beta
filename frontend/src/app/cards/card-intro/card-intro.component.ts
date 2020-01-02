import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-intro',
  templateUrl: './card-intro.component.html',
  styleUrls: ['./card-intro.component.css']
})
export class CardIntroComponent {

  @Input()
  image: string;

  @Input()
  logo: string;

  @Input()
  title: string;

  @Input()
  description: string;

}
