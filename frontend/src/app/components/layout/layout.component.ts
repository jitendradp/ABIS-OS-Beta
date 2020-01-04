import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  @Input()
  alignContainer: string = "space-around stretch"; // Options: left, right, center, space-around center | For more visit: https://tburleson-layouts-demos.firebaseapp.com/#/docs

  @Input()
  gapWidth: number = 0;

  @Input()
  layoutWidth: string = "100%";

  @Input()
  layoutHeight: string = "100%";

}
