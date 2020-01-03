import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  @Input()
  alignTiles: string = "left";

  @Input()
  gapWidth: number = 10;

  @Input()
  flexRegular: string = "auto";

  @Input()
  flexMedium: string = "33";

  @Input()
  flexSmall: string = "50";

}
