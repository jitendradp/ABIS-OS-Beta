import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent {

  @Input()
  collapsed: boolean;

  /*focusMethod = function getFocus() {
    document.getElementById("inputField").focus();
  }*/

}
