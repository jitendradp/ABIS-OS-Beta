import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  @Input()
  flexRegular: string = "auto";

  @Input()
  flexMedium: string = "33";

  @Input()
  flexSmall: string = "50";

}
