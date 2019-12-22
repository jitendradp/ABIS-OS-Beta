import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  options: string[] = ['Page1', 'Page2', 'Page3'];

  constructor() {
  }

  ngOnInit() {
  }

}
