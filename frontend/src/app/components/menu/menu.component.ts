import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  options: string[] = ['Option1', 'Option2', 'Option3'];

  constructor() {
  }

  ngOnInit() {
  }

}
