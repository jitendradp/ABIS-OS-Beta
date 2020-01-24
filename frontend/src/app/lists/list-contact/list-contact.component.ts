import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent {

  @Input()
  collapsed: boolean;

  @Input()
  showActions: boolean;

}
