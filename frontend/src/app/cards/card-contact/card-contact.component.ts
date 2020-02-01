import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.css']
})
export class CardContactComponent {

  @Input()
  contactPicture: string;

  @Input()
  contactFullName: string;

  @Input()
  subtitle: string;

}
