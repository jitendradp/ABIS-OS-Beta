import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input()
  link: string;

  @Input()
  image: string;

  @Input()
  showImage: boolean;

  @Input()
  showButton: boolean;

  @Input()
  subtitle: string;

  @Input()
  showIcon: boolean;

  @Input()
  icon: string;

  @Input()
  title: string;

}
