import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-whitespace',
  templateUrl: './whitespace.component.html',
  styleUrls: ['./whitespace.component.css']
})
export class WhitespaceComponent {

  @Input()
  height: string = "16px";

}
