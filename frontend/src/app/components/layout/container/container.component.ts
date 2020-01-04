import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  @Input()
  flexRegular: string = "100";

  @Input()
  flexMedium: string = "100";

  @Input()
  flexSmall: string = "100";

}
